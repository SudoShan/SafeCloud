const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    encryptedFilePath: {
        type: String,
        required: true
    },
    encryptedAESKey: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("File", fileSchema);