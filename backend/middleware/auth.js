const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

exports.admin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You don't have permission" });
    }
    next();
};