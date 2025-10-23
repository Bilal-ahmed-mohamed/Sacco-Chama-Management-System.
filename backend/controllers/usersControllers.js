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
        
        
         const token = createToken(user.user_id)
            return  res.status(200).json({
                 success : true,
                 message : "logged in",
                 token,
                 user :{
                    user_id: user.user_id,
                    userName : user.userName,
                    email : user.email,
                    role : user.role
                    
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



const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id, {
      attributes: ["user_id", "email", "phone"],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// admin to fetch all the users 
const getTotalMembers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const members = await Users.findAll({
      attributes: ["user_id", "userName", "email", "status", "createdAt"],
    });

    res.status(200).json({ success: true, members }); // no counts here
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {signupUser, loginUser , getUserProfile , getTotalMembers}