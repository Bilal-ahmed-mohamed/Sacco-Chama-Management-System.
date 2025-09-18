const LoanRepayments = require("../models/loanRepaymentsModel");
const Loans = require("../models/loansModels");

//  function to fetch indiviual loan for a user
const getRepaymentsByUser =  async(req,res) => {

    try {
         const {user_id} = req.params;
         const repayments = await LoanRepayments.findAll({where : {user_id}});

        res.status(200).json({
            success : true,
            user_id,
            repayments
        })
    } catch (error) {
         res.status(500).json({ success: false, message: "Server error", error: error.message });
    }

}
const loanRepayment = async (req,res) => {


    try {
        const {loan_id,user_id,amount,date,method} = req.body;
    
    if (!loan_id || !user_id || !amount || !date || !method) {
        return res.status(400).json({
            success : false,
            message : "All fields are required"
        })
    }

   if (isNaN(amount) || amount <= 0 ) {
        return res.status(400).json({
            success : false,
            message : "amount must be a positive number"
        })
   }

//    check if loan exists
   const checkLoan = await Loans.findByPk(loan_id)
   if (!checkLoan) {
     return res.status(404).json({
        success : false,
        message : "loan not found"
     })
   }
// check if the loan belongs to the user
   if (checkLoan.user_id !== user_id) {
        return res.status(403).json({
            success : false,
            message : "the loan does not belong to the user"
        })
   }

//    calculate total paid so far

      const totalPaid = await LoanRepayments.sum("amount" ,  {
          where : {loan_id : loan_id}
        }) || 0;
        const remainingBalance = checkLoan.amount - totalPaid;

      if (remainingBalance <= 0) {
            return res.status(400).json({
                success: false,
                message: "Loan already fully repaid",
            });
        }

        let adjustedAmount = amount;

        // prevent overpayment → adjust automatically
        if (amount > remainingBalance) {
            adjustedAmount = remainingBalance;
        }
   const repayment =  await LoanRepayments.create({
        loan_id,
        user_id,
        amount : adjustedAmount,
        method,
        date,
   });

   // update loan status if fully repaid
        if (totalPaid + adjustedAmount >= checkLoan.amount) {
            checkLoan.status = "repaid";
            await checkLoan.save();
        }


        res.status(201).json({
            success: true,
            message:
                adjustedAmount < amount
                    ? `Overpayment prevented. Only ${adjustedAmount} recorded, excess ignored.`
                    : "Repayment recorded",
            repayment,
            remainingBalance: remainingBalance - adjustedAmount,
        });

    }
     catch (error) {
         res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
    

}

module.exports = {loanRepayment , getRepaymentsByUser}