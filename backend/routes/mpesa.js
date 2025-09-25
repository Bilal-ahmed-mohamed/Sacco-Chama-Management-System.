const express = require("express");
const { simulateContribution } = require("../controllers/simulateContributionController");
const { c2bCallback } = require("../controllers/c2bController");
const { disburseLoan } = require("../controllers/b2cController");
const router = express.Router();

// C2B simulation route
router.post("/simulate", simulateContribution);
router.post("/c2b" , c2bCallback)
router.post("/disburse", disburseLoan);



// Safaricom will hit these
router.post("/result", b2cResultCallback);
router.post("/timeout", b2cTimeoutCallback);

module.exports = router;
