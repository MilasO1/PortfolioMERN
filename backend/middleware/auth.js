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
    try {
        if (req.user.role !== "admin") {
            return next({ status: 403, message: "Forbidden" });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = { protect, admin };