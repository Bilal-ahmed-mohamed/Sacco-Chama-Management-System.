const dayJs = require("dayjs");
const Loans = require("../models/loansModels");
const dayjs = require("dayjs");


// loan application 

const loanApplication = async (req, res) => {
    
    try {
        const {user_id, amount,reason,issued_date,due_date} = req.body;

        if (!user_id || !amount ||  !reason || !issued_date || !due_date) {
            
            return res.status(400).json({
                success: false,
                message : "All fields are required"
            })
        }
        if (isNaN(amount) || amount < 0) {
            return res.status(400).json({
                success : false,
                message : "Amount must be a positive number"
            })
        }
        // validate date formats
  
        if (!dayjs(issued_date, "YYYY-MM-DD", true).isValid() ||
            !dayjs(due_date, "YYYY-MM-DD", true).isValid()) {
            return res.status(400).json({
            success: false,
            message: "Dates must be in YYYY-MM-DD format"
             });
        }
    
        // validate ordering 
        if (dayjs(due_date).isBefore(dayjs(issued_date))) {
            return res.status(400).json({
                success: false,
                message: "Due date must be after issued date"
            });
        }
        
        // check how mmany active loans this user has
        const activeLoans = await Loans.count({
            where : {
                user_id,
                status: ["pending", "approved"]
            }
        });

        if (activeLoans >= 3) {
            return res.status(400).json({
                success: false,
                message: "You cannot apply for more than 3 active loans"
            });
        }
    
        const Loan = await Loans.create({
            user_id,
            amount,
            status : "pending",
            reason,
            issued_date,
            due_date
        });

        
        res.status(201).json({
            success : true,
            message : "New loan requested ",
            Loan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

module.exports = {loanApplication}