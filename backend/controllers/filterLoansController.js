const Loans = require("../models/loansModels");
const {Op} = require("sequelize");
const dayjs = require("dayjs");
const Users = require("../models/userModel")

const filterLoans =  async (req,res) => {
    
    try {
        const {status , user_id , startDate , endDate} = req.query;

        // dynamic filter
        const  whereClause = {};

        //  Role-based data restriction
    if (req.user.role !== "admin") {
      // Normal users only see their own loans
      whereClause.user_id = req.user.user_id;
    } else if (user_id) {
      // Admin can filter by specific user if provided
      whereClause.user_id = user_id;
    }
    // If admin and no user_id -> fetch all loans (no filter)

        //  Optional status filter
    if (status) {
      const validStatuses = ["pending", "approved", "rejected", "repaid"];
      if (!validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Use: pending, approved, rejected, repaid",
        });
      }
      whereClause.status = status.toLowerCase();
    }


        // date range filter
        if (startDate && endDate) {
            if (!dayjs(startDate, "YYYY-MM-DD" , true).isValid() || 
             !dayjs(endDate, "YYYY-MMM-DD" , true).isValid()) {
                return res.status(400).json({
                    success : false,
                    message : "Dates must be in YYYY-MM-DD format"
                });
            }
            
            whereClause.issued_date = {
                [Op.between] : [startDate , endDate]
            };
        }

        // query loans
        const loans = await Loans.findAll({where : whereClause, 
            include :[
                {
                        model: Users,
                        attributes: [ "userName"], 
                },
            ]
         })

        if (loans.length === 0) {
            return res.status(200).json({
                success : true,
                message : "No loans found with given filters",
                loans : []
            })
        }

        res.status(200).json({
            success : true,
            count : loans.length,
            loans
        });
    } catch (error) {
         res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

module.exports = {filterLoans};