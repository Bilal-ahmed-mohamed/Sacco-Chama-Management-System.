const bcrypt = require("bcrypt");
const Users = require("../models/userModel");

const changePassword =  async (req,res) => {
    const {oldPassword , newPassword} = req.body;

    try {
        // validation of both passwords
        if (!oldPassword || !newPassword) {
            return res.status(400).json({success: false, message: "both old and new passwords are required"})
        }
        // get logged in user from middleware
        const user = req.user;
        if (!user) {
            return res.status(400).json({success: false , message: "unauthorized"})
        }

        // compare passwords
        const isMatch = await bcrypt.compare(oldPassword , user.password);

        if (!isMatch) {
            return res.status(400).json({success : false, message:"old password is incorrect"})
        }

        // validate new password
        if (newPassword.length < 8) {
             return res.status(400).json({ success: false, message: "New password must be at least 8 characters" });
        }

        // hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword , salt);


        // update user
        user.password = hashedPassword;
        user.must_change_password = false;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }

};

module.exports = {changePassword};