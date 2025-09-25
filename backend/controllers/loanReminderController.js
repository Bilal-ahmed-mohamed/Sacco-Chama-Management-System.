const Loans = require("../models/loansModels");
const Users = require("../models/userModel");
const {Op, where} = require("sequelize");
const dayjs = require("dayjs");
const nodemailer = require("nodemailer");


const Transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.EMAIL,
        pass : process.env.EMAIL_PASS
    },
})

const sendLoanRemainders = async () => {
    try {
        const today = dayjs().startOf("day").toDate();
        const next7days = dayjs().add(7, "day").endOf("day").toDate();

        // find loas due in the next 7 days and not remineed yet
        const loans = await findAll({
            where : {
                status : "approved",
                due_date : {[Op.between] : [today, next7days]},
                reminder_sent : false,
            },
            include : [{model: Users, attributes : ["userName", "email"]}]
        })

        for(const loan of loans){
            const {userName, email} = loan.user;
            const message = `
                Hello ${userName},
                
                This is a reminder that your loan of KES ${loan.amount} 
                is due on ${dayjs(loan.due_date).format("YYYY-MM-DD")}.
                
                Please ensure repayment before the due date to avoid penalties.

                Thank you,
                Sacco System
            `;

            await Transporter.sendMail({
                from: `"Sacco System" <${process.env.EMAIL}>`,
                to: email,
                subject: "Loan Due Reminder",
                text: message,
            })

            console.log(`Reminder sent to ${email}`);

             // mark as reminded
            loan.reminder_sent = true;
            await loan.save();
            
        }
        console.log("Loan reminders job finished");
    } catch (error) {
         console.error("Reminder job failed ", error.message);
    }
};

module.exports = {sendLoanRemainders};
