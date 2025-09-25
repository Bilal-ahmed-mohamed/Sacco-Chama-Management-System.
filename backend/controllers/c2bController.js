const Contributions = require("../models/contributionsModel");

const c2bCallback = async (req,res) => {
    try {
        console.log("C@B Callback", req.body);

        const {TransAmount, MSISDN, TransID, TransTime, BillRefNumber} = req.body;

        // save contribution
        await Contributions.create({
            user_id: BillRefNumber,
            amount: TransAmount,
            method: "mpesa",
            date: TransTime ? new Date() : new Date(),
            Transaction_id : TransID
        });

        // reply to safaricom (important or they will retry)
        res.json({ ResultCode : 0, ResultDesc: "Accepted"});
        
    } catch (error) {
        console.log("C2B callback error", error.message);
        res.json({ ResultCode: 1, ResultDesc: "Failed to process" });
    }
};

module.exports = {c2bCallback}