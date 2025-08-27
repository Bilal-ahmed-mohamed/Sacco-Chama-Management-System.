const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");

// check authentication

const authMiddleware = async(req,res,next) => {
    const authHeader = req.headers.authorization;
     if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "not authorized" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({success : false, message : "not authorized"});

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await Users.findByPk(decoded.id);
        if (!user) return res.status(401).json({success : false, message: "user not found"});
        
        req.user = user;
        next();
            
    } catch (error) {
        return res.status(401).json({success : false, message: "invalid token"});
    }
};

// check role
const roleMiddleWare = (role) => {
    return (req,res,next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ success : false, message : "forbidden admin only"});
        }
        next();
    };
};

module.exports = {authMiddleware , roleMiddleWare};