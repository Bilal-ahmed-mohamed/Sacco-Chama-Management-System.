require("dotenv").config();
const axios = require("axios");


const getAccessToken = async () => {
    const consumerKey = process.env.MPESA_CONSUMER_KEY
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");


    try {
        const response = await axios.get(
            "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
             { headers: { Authorization: `Basic ${auth}` } }
        );
        return response.data.access_token;
    } catch (error) {
        throw new Error(error.response?.data?.errorMessage || "Failed to get access token");
    }
}


module.exports = {getAccessToken}