const axios = require("axios");

const { getAccessToken } = require("../lib/auth");

const simulateContribution = async (req,res) => {
    const {phoneNumber , amount} = req.body;

    if (!phoneNumber || !amount) {
        return res.status(400).json({
            success : false,
            message : "phoneNumber and amount are required"
        });
    }

    try {
        const token = await getAccessToken();

        const response = await axios.post(
            "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate",
            {
                ShortCode: process.env.SHORTCODE, // test Paybill
                CommandID: "CustomerPayBillOnline",
                Amount: amount,
                Msisdn: phoneNumber, // e.g. 254708374149
                BillRefNumber: "SaccoContrib",
            },
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
        );

        res.status(200).json({
             success: true,
             message: "Contribution simulated",
             data: response.data,
        })
    
    } catch (error) {
        res.status(500).json({
        success: false,
        error: error.response?.data || error.message,
    });
    }
};

module.exports = {simulateContribution}