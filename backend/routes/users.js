const express = require("express");
const Users =  require("../models/userModel")
const {signupUser, loginUser} = require("../controllers/usersControllers");


const router = express.Router();

router.post('/signup' , signupUser);

router.post('/login' , loginUser);

module.exports = router;