const express = require("express");
const router = express.Router();

const {
    getPublicKey,
    decryptPrivateKey
} = require("../controllers/keyController");

const authMiddleware = require("../middleware/authMiddleware");

// Get public key
router.get("/public-key/:user_id", authMiddleware, getPublicKey);

module.exports = router;