import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const { sign } = jwt;
const { genSalt, hash, compare } = bcrypt;

const generateToken = (id) => {
    return sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Existing user"});
        }
        const user = await User.create({ name, email, password});
        const salt = await genSalt(10);
        user.password = await hash(password, salt);


        const token = generateToken(user._id);

        res.status(201).json({ user, token });
    } catch (error) {
        return next (error);
        }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!email || !password) {
            return next ({ status: 400, message: "Please enter email and password" });
        }

        if (!user || !(await compare(password, user.password))) {
            return next ({ status: 400, message: "Invalid email or password" });
        }

        const token = generateToken(user._id);

        res.cookie('jwt', token, { httpOnly: true });

        res.status(200).json({ user, token });
    } catch (error) {
        return next (error);
    }
}

export async function getAllUsers(req, res, next) {
    try {
        const users = await User.find({}).select("-password");
        res.status(200).json({ users });
    } catch (error) {
        return next (error);
    }
}