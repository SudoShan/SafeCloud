const File = require("../models/File");
const createLog = require("../services/logService");

const uploadFile = async (req, res) => {
    try {
        const userId = req.user.id; // from auth middleware
        const { encryptedAESKey, fileName } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const filePath = req.file.path;
        const fileId = req.fileId;

        const newFile = await File.create({
            fileName: fileName,
            ownerId: userId,
            encryptedFilePath: filePath,
            encryptedAESKey: encryptedAESKey,
        });

        // Create log
        await createLog(userId, "UPLOAD_FILE", {
            fileId: newFile._id,
            fileName: fileName
        });

        res.status(201).json({
            message: "File uploaded successfully",
            fileId: newFile._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    uploadFile
};