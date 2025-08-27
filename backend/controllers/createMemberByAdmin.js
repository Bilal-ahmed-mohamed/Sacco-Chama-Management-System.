const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");



const createToken = (id) => {
    return jwt.sign({id} , process.env.SECRET , {expiresIn : '3d'})
}


// function to generate random strong passsword
const generateTempPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    
    let password = "";
    for (let i = 0; i < 10; i++) {
       
        password += chars.charAt(Math.floor(Math.random() * chars.length));
        
    }
    return password;
};

// email sender setup

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.EMAIL,
        pass : process.env.EMAIL_PASS
    }
});

const createMemberByAdmin = async (req,res) => {
    const {userName, email, phone, role} = req.body;

    try {
        // validate inputs
        if (!userName || !email || !phone) {
            return res.status(400).json({success : false, message: "All fields are missing"})
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({success : false, message: "wrong email format"})
        }

        // check if email exits
        const exists = await Users.findOne({where : {email}});
        if (exists) {
            return res.status(400).json({success : false, message :"email already exists"})
        }

        // generate temp password and hashit
        const tempPassword = generateTempPassword();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempPassword, salt);

       


        const user = await Users.create({
            userName,
            email,
            phone,
            role: role || "member",
            status : "active",
            password : hashedPassword,
            must_change_password: true
        });


          const token = createToken(user.user_id)

        // send emnail
        try {
            await transporter.sendMail({
                from: `"Sacco System" <${process.env.EMAIL}>`,
                to: email,
                subject: "Your SACCO Account Details",
                text : `Hello ${userName}, \n\nYour account has been created.\nTemporary Password: ${tempPassword}\nPlease log in and change your password.\n\nThank you.`
            });
             console.log("Email sent to:", email);

        } catch (error) {
             console.log("Email sending failed:", emailError.message);
        }

        res.status(201).json({
            success: true,
            message : "member created successfully",
            tempPassword : tempPassword,
            user:{
                id: user.user_id,
                userName: user.userName,
                phone: user.phone,
                role: user.role,
                status: user.status,
                must_change_password: user.must_change_password
            },
            token
        });


    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = {createMemberByAdmin};