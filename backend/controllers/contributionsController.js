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
const fetchAllContributions = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const allContributions = await Contributions.findAll();

    if (!allContributions || allContributions.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No contributions found",
        contributions: [],
        totalContributions: 0,
      });
    }

    // Calculate total contributions (sum of all contribution amounts)
    const totalContributions = allContributions.reduce(
      (sum, contribution) => sum + (parseFloat(contribution.amount) || 0),
      0
    );

    res.status(200).json({
      success: true,
      message: "Contributions fetched successfully",
      contributions: allContributions,
      totalContributions,
    });

    console.log(
      "All Contributions:",
      JSON.stringify(allContributions, null, 2)
    );
    console.log("Total Contributions:", totalContributions);
  } catch (error) {
    console.error("Error fetching contributions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching contributions",
      error: error.message,
    });
  }
};



// create contributions
const registerContributions = async (req, res) => {
  try {
    const { user_id, amount, method, date } = req.body;

    // Validate required fields
    if (!user_id || !amount || !method) {
      return res.status(400).json({
        success: false,
        message: "user_id, amount, and method are required",
      });
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "amount must be a positive number",
      });
    }

    //  Generate a fake transaction_id for simulation (since you're not live yet)
    const transaction_id = "MPESA" + Math.floor(100000 + Math.random() * 900000);

    const formattedDate = new Date().toISOString().split("T")[0];
    // Create contribution record
    const newContribution = await Contributions.create({
      user_id,
      amount,
      method,
      transaction_id, // ✅ added
      date: formattedDate,
    });

    res.status(201).json({
      success: true,
      message: "New contribution added",
      newContribution,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = {registerContributions , fetchAllContributions , fetchContributionByUser , fetchContributionsByDate}