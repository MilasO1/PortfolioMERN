import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const { genSalt, hash, compare } = bcrypt;

const userSchema = new Schema({
    name: {
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
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "admin"
    },
    skills: [
        {
            type: Schema.Types.ObjectId,
            ref: "Skill"
        }
    ]
},
{
    timestamps: true
}
);

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await genSalt(10);
        this.password = await hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.matchPassword = async function (password) {
    try {
        return await compare(password, this.password);
    } catch (error) {
        throw error;  
    }
}

export default model("User", userSchema);