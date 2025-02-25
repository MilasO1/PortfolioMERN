import jwt from "jsonwebtoken";
const { verify } = jwt;
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

 export const admin = (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return next({ status: 403, message: "Forbidden" });
        }
    } catch (error) {
        return next(error);
    }
};

export default { protect, admin };