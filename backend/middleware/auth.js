import jwt from "jsonwebtoken";
const { verify } = jwt;
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        // Check for token in the Authorization header
        const token = req.headers.authorization?.split(" ")[1]; // Format: "Bearer <token>"
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const decoded = verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        req.user = user; // Attach the user to the request object
        next();
    } catch (error) {
        console.error("Error in protect middleware:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized - Token expired" });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        res.status(401).json({ message: "Unauthorized" });
    }
};

export const admin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    next();
};

export default { protect, admin };