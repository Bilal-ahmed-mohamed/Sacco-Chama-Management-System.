const axios = require("axios");
const { getAccessToken } = require("../lib/auth");

const disburseLoan = async (req, res) => {
  const { phoneNumber, amount, occasion } = req.body;

  if (!phoneNumber || !amount) {
    return res.status(400).json({
      success: false,
      message: "phoneNumber and amount are required",
    });
  }

  try {
    const token = await getAccessToken();

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest",
      {
        InitiatorName: process.env.INITIATOR_NAME, // from Safaricom
        SecurityCredential: process.env.SECURITY_CREDENTIAL, // encrypted initiator password
        CommandID: "BusinessPayment", // or SalaryPayment, PromotionPayment
        Amount: amount,
        PartyA: process.env.SHORTCODE, // your Paybill (e.g. 600999 for sandbox)
        PartyB: phoneNumber, // user’s phone number e.g. 2547xxxxxxx
        Remarks: "Loan disbursement",
        QueueTimeOutURL: process.env.TIMEOUT_URL, // your callback for timeout
        ResultURL: process.env.RESULT_URL,       // your callback for results
        Occasion: occasion || "LoanApproval"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Loan disbursement request sent",
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};

module.exports = { disburseLoan };
