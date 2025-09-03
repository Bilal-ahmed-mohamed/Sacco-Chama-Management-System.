const express = require('express');
const { registerContributions,
        fetchAllContributions,
        fetchContributionByUser,
    fetchContributionsByDate } = require("../controllers/contributionsController");


const router = express.Router();


router.post('/', registerContributions);

router.get('/' , fetchAllContributions);
router.get('/:user_id' , fetchContributionByUser)

router.get('/date/filter', fetchContributionsByDate )
module.exports = router;