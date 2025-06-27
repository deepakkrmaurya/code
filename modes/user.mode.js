import { model ,Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname:{
type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    passwordResetToken:{
        type: String,
    },
    passwordResetTokenExpiry:{
        type: Date,
    }
},{
    timestamps:true
});

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.createJWTToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}



const User = model("User", userSchema);

export default User;