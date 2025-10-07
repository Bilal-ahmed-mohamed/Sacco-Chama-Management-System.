const express = require("express");
const { simulateContribution } = require("../controllers/simulateContributionController");
const { c2bCallback } = require("../controllers/c2bController");
const { b2cResultCallback, b2cTimeoutCallback} = require("../controllers/b2cCallbackController");
const {disburseLoan } = require("../controllers/b2cController");
const router = express.Router();


// Debug: Check what was imported
console.log("simulateContribution:", typeof simulateContribution);
console.log("c2bCallback:", typeof c2bCallback);
console.log("b2cResultCallback:", typeof b2cResultCallback);
console.log("b2cTimeoutCallback:", typeof b2cTimeoutCallback);
console.log("disburseLoan:", typeof disburseLoan);

// C2B simulation route
router.post("/simulate", simulateContribution);
router.post("/c2b" , c2bCallback)
router.post("/disburse", disburseLoan);



// Safaricom will hit these
router.post("/result", b2cResultCallback);
router.post("/timeout", b2cTimeoutCallback);

module.exports = router;
