import User from "../modes/user.mode.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/Email.js";
import crypto from "crypto";
const Register = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            })
        }
        const verifiUser = await User.findOne({ email });
        if (verifiUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        const user = await User.create({
            firstname,
            lastname,
            email,
            password
        });
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            })
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }
        const options = {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            secure: true
        }
        const token = user.createJWTToken();

        user.password = undefined;
        return res.status(200)
            .cookie("token", token, options)
            .json({
                success: true,
                message: "User logged in successfully",
                user,
                token
            })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

const GetUser = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }

}


const forGotPassword = async(req,res)=>{
    try {
         const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide an email"
            })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        const resetToken = await crypto.randomBytes(20).toString('hex');
       
        const resetUrl = `<a href=${process.env.FRONTEND_URL}/reset-password/${resetToken}>Reset your password</>`;
         user.passwordResetToken = resetToken;
         user.passwordResetTokenExpiry = Date.now() + 5 * 60 * 1000; // 30 minutes expiry
        await user.save({ validateBeforeSave: false });
        await sendEmail(email,resetUrl)
        
        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email",
            resetUrl
        })
 
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
        
    }
}
const resetPassword = async(req,res)=>{
    try {
        const token = req.params.token;
        const { newPassword,Oldpassword } = req.body;
       
        if(!token || !newPassword || !Oldpassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields"
            })
        }
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetTokenExpiry: { $gt: Date.now() }
        });
      
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid or expired token"
            })
        }
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiry = undefined;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
        
    }
}


export { Register, Login, GetUser,forGotPassword,resetPassword };