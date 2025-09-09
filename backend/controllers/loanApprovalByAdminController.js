
const Loans = require("../models/loansModels");

const LoanApproval = async (req,res) => {

    const {loan_id} = req.params;
    const {status} = req.body;

    // validate status
    if (!["approved", "rejected"].includes(status)) {
         return res.status(400).json({success : false , message: "invalid status"})
    }

    const loan = await Loans.findByPk(loan_id);
    if (!loan) {
        return res.status(400).json({success : false , message : "loan not found"})
    }
 
    loan.status = status;
    await loan.save();

    res.status(200).json({success : true,  message : `Loan ${status}  successfully`,loan})

};

module.exports = {LoanApproval}