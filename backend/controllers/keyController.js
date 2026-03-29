const User = require("../models/User");
const CryptoJS = require("crypto-js");

// GET /api/public-key/:user_id
const getPublicKey = async (req, res) => {
    try {
        const userId = req.params.user_id;

        const user = await User.findById(userId).select("publicKey");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            userId: userId,
            publicKey: user.publicKey
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getPublicKey,
};