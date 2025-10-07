const Loans = require("../models/loansModels");
const { disburseLoan } = require("./b2cController");

const b2cResultCallback = async (req, res) => {
  try {
    const result = req.body;

    console.log("B2C Result Callback:", JSON.stringify(result, null, 2));

    // Extract Safaricom fields
    const resultCode = result.Result.ResultCode;
    const transactionId = result.Result.TransactionID;
    const amountParam = result.Result.ResultParameters?.ResultParameter.find(p => p.Key === "TransactionAmount");
    const amount = amountParam ? amountParam.Value : null;

    // Map loan_id from ConversationID (we’ll send it during disbursement)
    const conversationId = result.Result.OriginatorConversationID;
    const loanId = conversationId.split("_")[1]; // e.g., "Loan_5" → 5

    const loan = await Loans.findByPk(loanId);

    if (!loan) {
      console.error(`Loan with ID ${loanId} not found`);
      return res.json({ ResultCode: 0, ResultDesc: "Loan not found, but callback received" });
    }

    if (resultCode === 0) {
      loan.status = "disbursed";
      loan.transaction_id = transactionId; // Add this column if not already in DB
      await loan.save();
      console.log(`Loan ${loanId} marked as disbursed.`);
    } else {
      loan.status = "failed";
      await loan.save();
      console.log(`Loan ${loanId} marked as failed.`);
    }

    // Reply to Safaricom
    res.json({ ResultCode: 0, ResultDesc: "Callback received successfully" });

  } catch (error) {
    console.error("B2C Callback Error:", error.message);
    res.status(500).json({ ResultCode: 1, ResultDesc: "Error processing callback" });
  }
};

const b2cTimeoutCallback = async (req, res) => {
  console.log("B2C Timeout Callback:", JSON.stringify(req.body, null, 2));
  res.json({ ResultCode: 0, ResultDesc: "Timeout acknowledged" });
};

module.exports = { b2cResultCallback, b2cTimeoutCallback};
