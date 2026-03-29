const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    encryptedLogData: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    action: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Log", logSchema);