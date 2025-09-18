const express = require("express");

const {loanApplication, filterLoansByStatus} = require("../controllers/LoansController");
const {LoanApproval} = require("../controllers/loanApprovalByAdminController")
const {authMiddleware , roleMiddleWare} = require("../middleware/authMiddleware")
const {loanRepayment,
    getRepaymentsByUser
} = require("../controllers/loanRepaymentController");
const {filterLoans} = require("../controllers/filterLoansController");

const router = express.Router();

router.post("/apply" , loanApplication);
router.put('/:loan_id/status', authMiddleware, roleMiddleWare("admin") ,LoanApproval);

router.post("/loanRepayment" , loanRepayment);




router.get("/filter", authMiddleware, filterLoans);

module.exports = router;