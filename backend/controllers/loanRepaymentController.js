const LoanRepayments = require("../models/loanRepaymentsModel");
const Loans = require("../models/loansModels");


const getRepaymentsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Get all user loans
    const loans = await Loans.findAll({ where: { user_id } });

    if (!loans.length) {
      return res.status(404).json({ success: false, message: "No loans found for this user" });
    }

    // For each loan, fetch repayment summary
    const loanDetails = await Promise.all(
      loans.map(async (loan) => {
        const repayments = await LoanRepayments.findAll({
          where: { loan_id: loan.loan_id },
        });

        const totalPaid = repayments.reduce((sum, r) => sum + parseFloat(r.amount), 0);
        const remaining = parseFloat(loan.amount) - totalPaid;

        // Update loan repayment info
        loan.amount_repaid = totalPaid;
        loan.amount_remaining = remaining;
        await loan.save();

        return {
          loan_id: loan.loan_id,
          totalAmount: loan.amount,
          totalPaid,
          remaining,
          status: loan.status,
          reminder_sent: loan.reminder_sent,
          due_date: loan.due_date,
          repayments,
        };
      })
    );

    res.status(200).json({
      success: true,
      user_id,
      loans: loanDetails,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Record loan repayment + auto-generate transaction_id
const loanRepayment = async (req, res) => {
  try {
    const { loan_id, user_id, amount, date, method } = req.body;

    if (!loan_id || !user_id || !amount || !date || !method) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    // Check if loan exists
    const checkLoan = await Loans.findByPk(loan_id);
    if (!checkLoan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found",
      });
    }

    // Verify loan belongs to the user
    if (checkLoan.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: "This loan does not belong to the user",
      });
    }

    // ensure loan is approved before its repaid
    if (checkLoan.status !== "approved" && checkLoan.status !== "active") {
      return res.status(400).json({
        success : false,
        message : `Loan cannot be repaid because its status is '${checkLoan.status}'. Only approved loans can be repaid.`
      })
    };

    // Calculate total paid so far
    const totalPaid = (await LoanRepayments.sum("amount", { where: { loan_id } })) || 0;
    const remainingBalance = checkLoan.amount - totalPaid;

    if (remainingBalance <= 0) {
      return res.status(400).json({
        success: false,
        message: "Loan already fully repaid",
      });
    }

    let adjustedAmount = amount;
    if (amount > remainingBalance) {
      adjustedAmount = remainingBalance; // Prevent overpayment
    }

    //  Generate fake transaction_id for simulation
    const transaction_id = "MPESA" + Math.floor(100000 + Math.random() * 900000);

    // Record repayment
    const repayment = await LoanRepayments.create({
      loan_id,
      user_id,
      amount: adjustedAmount,
      method,
      date,
      transaction_id,
    });

    // Update loan status if fully repaid
    if (totalPaid + adjustedAmount >= checkLoan.amount) {
      checkLoan.status = "repaid";
      await checkLoan.save();
    }

    res.status(201).json({
      success: true,
      message:
        adjustedAmount < amount
          ? `Overpayment prevented. Only ${adjustedAmount} recorded, excess ignored.`
          : "Repayment recorded successfully",
      repayment,
      remainingBalance: remainingBalance - adjustedAmount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { loanRepayment, getRepaymentsByUser };
