const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Existing user"});
        }
        const user = await User.create({ name, email, password});
        const token = generateToken(user._id);

        res.cookie(jwt, token, { httpOnly: true });

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
        }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ message: "Wrong email or password"});
        }

        const token = generateToken(user._id);

        res.cookie(jwt, token, { httpOnly: true });

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}