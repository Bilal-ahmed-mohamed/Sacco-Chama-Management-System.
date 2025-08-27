const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const createToken = (id) => {
    return jwt.sign({id} , process.env.SECRET , {expiresIn : '3d'})
}


// login function

const loginUser = async (req,res) =>{
    const {email, password} = req.body;

    try {
            // validation
    if ( !email ||  !password ) {
        return res.status(400).json({
            success : false,
            message : "all fields are required"
        })
    }

    // email validation
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success : false,
            message : "your email is not valid"
        })
    }
    
    // find user

    const user = await Users.findOne({where : {email : email}})
    if (!user) {
        return res.status(400).json({
            success : false,
            message : "the email given is not recogonised"
        })
    }

    // compare password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password", // generic for security
            });
        }
        
        // generate token
        
        
         const token = createToken(user.id)
            return  res.status(200).json({
                 success : true,
                 message : "logged in",
                 token,
                 user :{
                    id: user.id,
                    userName : user.userName,
                    email : user.email,
                    
                 },
            });
       
    
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Server error",
            error : error.message,
        });
    }

}

// signup function

const signupUser = async (req,res) => {
    const {userName,email,phone,password,role,status} = req.body;
  
    try {
        
   
    // validation
    if (!userName || !email || !phone || !password || !role || !status) {
        return res.status(400).json({
            success : false,
            message : "all fields are required"
        })
    }

    // email validation
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success : false,
            message : "your email is not valid"
        })
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({
            success : false,
            message : "Your password is not strong"
        })
    }

   
        const Exists = await Users.findOne({where : {email : email}})
        if (Exists) {
            return res.status(400).json({
                success : false,
                message : "The email already exists",
                
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = await Users.create({
            userName,
            email,
            phone,
            password:hash,
            role ,  
            status,
        });

        // create token
        const token = createToken(user.user_id);

        res.status(201).json({
            success : true,
            message : "You have Signed Up",
            token,
            
            user:{
                id : user.id,
                username : user.userName,
                email : user.email,
                phone : user.phone,
                role : user.role,
                status : user.status
            }

        });


      } catch (error) {
        res.status(500).json({
            success : false,
            message : "Server error",
            error : error.message,
        });
    }
}

module.exports = {signupUser, loginUser}