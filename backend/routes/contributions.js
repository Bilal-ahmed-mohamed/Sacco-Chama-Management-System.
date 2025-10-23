const express = require('express');
const { registerContributions,
        fetchAllContributions,
        fetchContributionByUser,
    fetchContributionsByDate } = require("../controllers/contributionsController");
const {authMiddleware , roleMiddleWare} = require("../middleware/authMiddleware");

const router = express.Router();


router.post('/', registerContributions);

router.get('/' , authMiddleware ,  fetchAllContributions);
router.get('/:user_id' , fetchContributionByUser)

router.get('/date/filter', fetchContributionsByDate )
module.exports = router;