const express = require("express");

const {loanApplication} = require("../controllers/LoansController");
const {LoanApproval} = require("../controllers/loanApprovalByAdminController")
const {authMiddleware , roleMiddleWare} = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/apply" , loanApplication);
router.put('/:loan_id/status', authMiddleware, roleMiddleWare("admin") ,LoanApproval);



module.exports = router;