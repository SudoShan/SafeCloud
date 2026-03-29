const File = require("../models/File");
const createLog = require("../services/logService");
const fs = require("fs");

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

// GET /api/files → List user files
const listFiles = async (req, res) => {
    try {
        const userId = req.user._id;

        const files = await File.find({ ownerId: userId }).select(
            "_id fileName uploadDate"
        );

        res.json(files);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/files/:file_id → Download encrypted file

const downloadFile = async (req, res) => {
    try {
        const fileId = req.params.file_id;
        const userId = req.user._id;

        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        if (file.ownerId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Read encrypted file from storage
        const encryptedFileBuffer = fs.readFileSync(file.encryptedFilePath);

        // Convert to base64 to send via JSON
        const encryptedFileBase64 = encryptedFileBuffer.toString("base64");

        // Log download
        await createLog(userId, "DOWNLOAD_FILE", {
            fileId: file._id,
            fileName: file.fileName
        });

        res.json({
            fileId: file._id,
            fileName: file.fileName,
            encryptedAESKey: file.encryptedAESKey,
            fileData: encryptedFileBase64
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// DELETE /api/files/:file_id → Delete file
const deleteFile = async (req, res) => {
    try {
        const fileId = req.params.file_id;
        const userId = req.user._id;

        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        if (file.ownerId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Delete file from storage
        fs.unlinkSync(file.encryptedFilePath);

        // Delete DB record
        await File.findByIdAndDelete(fileId);

        await createLog(userId, "DELETE_FILE", {
            fileId: file._id,
            fileName: file.fileName
        });

        res.json({ message: "File deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/files/:file_id/metadata → File info
const getFileMetadata = async (req, res) => {
    try {
        const fileId = req.params.file_id;
        const userId = req.user._id;

        const file = await File.findById(fileId).select(
            "fileName uploadDate ownerId"
        );

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        if (file.ownerId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json({
            fileId: file._id,
            fileName: file.fileName,
            uploadDate: file.uploadDate
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    uploadFile,
    listFiles,
    downloadFile,
    deleteFile,
    getFileMetadata
};