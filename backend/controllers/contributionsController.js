const {Op} = require("sequelize");
const Contributions = require("../models/contributionsModel");


// fetchcontributionsforasuer

const fetchContributionByUser = async (req,res) => {
    
    try {
        const {user_id} = req.params;

        const contribution = await Contributions.findAll({
            where : { user_id}
        });

        if (contribution.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No contributions found for this user",
                contributions: []
            });
        }
        res.status(200).json({
            success: true,
            contribution
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "server error",
            error : error.message
        })
    }
}

// fetchcontributionsbydate
const fetchContributionsByDate = async (req,res) => {
    try {
        const {startDate , endDate} = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success : false,
                message : "Start date and end date are required"
            });
        }
        const contributions = await Contributions.findAll({
            where : {
                date : {
                     [Op.between]: [
                     new Date(startDate), 
                     new Date(new Date(endDate).setHours(23, 59, 59, 999))  // inclusive till end of day
      ]
                }
            }
        });

        res.status(200).json({
            success : true,
            contributions
        })
    } catch (error) {
        res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
    });
    }
}

// fetch all contributions
const fetchAllContributions = async (req,res) => {
    try {
        const allContributions = await Contributions.findAll();

        if (allContributions.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No contributions found",
                contributions: []
            });
        }
        res.status(200).json({
            success : true,
            allContributions
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "no contributions"
        })
    }
      console.log("All Contributions:", JSON.stringify(allContributions, null, 2));
}


// create contributions
const registerContributions = async (req,res) => {


    try {
        
        const { user_id, amount, method, date } = req.body;
        if (!user_id || !amount || !method) {
             return res.status(400).json({
                success: false,
                message: "user_id, amount, and method are required"
            });
        }
        if (isNaN(amount) || amount <= 0 ) {
            return res.status(400).json({
                success: false,
                message: "amount must be a positive number"
            });
        }
        // create contribution
        const  newContribution =  await Contributions.create({
            user_id,
            amount,
            method,
            date : date || new Date()
        });

        res.status(201).json({
            success : true,
            message : "New contribution added",
            newContribution
        });

      
    } catch (error) {
         res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }


    
}

module.exports = {registerContributions , fetchAllContributions , fetchContributionByUser , fetchContributionsByDate}