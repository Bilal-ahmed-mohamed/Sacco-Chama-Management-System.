const express = require("express");
const Users =  require("../models/userModel")
const {signupUser, loginUser , getUserProfile , getTotalMembers} = require("../controllers/usersControllers");
const  {createMemberByAdmin} = require("../controllers/createMemberByAdmin");
const {authMiddleware , roleMiddleWare} = require("../middleware/authMiddleware");
const {changePassword} = require("../controllers/changePassword");





const router = express.Router();

router.post('/signup' , signupUser);

router.post('/login' , loginUser);



// route for admin to create member
router.post('/admin/create-member', authMiddleware , roleMiddleWare("admin"), createMemberByAdmin );

// route for updating the password
router.put("/change-password" , authMiddleware ,changePassword);


router.get("/profile/:id", getUserProfile);

router.get("/total-members", authMiddleware , getTotalMembers);
module.exports = router;