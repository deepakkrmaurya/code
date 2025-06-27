import jwt from "jsonwebtoken";
import User from "../modes/user.mode.js";
export const isAuthenticated = async (req, res, next) => {
    try {
     
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login to access this resource"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};