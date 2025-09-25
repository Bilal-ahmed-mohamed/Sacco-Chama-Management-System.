
const Loans = require("../models/loansModels");
const nodemailer = require("nodemailer");
const Users = require("../models/userModel");
const LoanApproval = async (req,res) => {

    const {loan_id } = req.params;
    const {status} = req.body;

    const transporter = nodemailer.createTransport({
        service :"gmail",
        auth : {
            user: process.env.EMAIL,
            pass : process.env.EMAIL_PASS
        }
    });

    // validate status
    if (!["approved", "rejected"].includes(status)) {
         return res.status(400).json({success : false , message: "invalid status"})
    }

    const loan = await Loans.findByPk(loan_id);
    if (!loan) {
        return res.status(400).json({success : false , message : "loan not found"})
    }
 
    // fetch user details
    const user = await Users.findByPk(loan.user_id);
    if (!user) {
        return res.status(400).json({
            success : false,
            message : "user not found"
        });
    }
    loan.status = status;
    await loan.save();

    // SEND EMAIL
    try {
        await transporter.sendMail({
            from : `"Sacco System" <${process.env.EMAIL}>`,
            to: user.email,
            subject: "Your Loan details",
            text: `Hello ${user.userName}, \n\n Your loan has been ${status}. \n\n thank you`
        });
        console.log("Email sent to:", email);
        
    } catch (error) {
        console.log("Email sending failed:", error.message);
    }

    res.status(200).json({success : true,  message : `Loan ${status}  successfully`,loan})

};



module.exports = {LoanApproval}