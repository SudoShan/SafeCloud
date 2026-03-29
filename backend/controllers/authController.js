const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BlacklistedToken = require("../models/BlackListedToken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });
};

// Register
const registerUser = async (req, res) => {
    try {
        const { username, password, publicKey, encryptedPrivateKey, role } = req.body;

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            passwordHash,
            publicKey,
            encryptedPrivateKey,
            role: role || "user"
        });

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Login
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        res.json({
            token,
            userId: user._id,
            username: user.username,
            publicKey: user.publicKey,
            encryptedPrivateKey: user.encryptedPrivateKey,
            role: user.role
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//logout
const logoutUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.decode(token);

        await BlacklistedToken.create({
            token: token,
            expiresAt: new Date(decoded.exp * 1000)
        });

        res.json({ message: "Logged out successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get User Info
const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-passwordHash");

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserInfo
};