const express = require("express");
const router = express.Router();

const {
    uploadFile,
    listFiles,
    downloadFile,
    deleteFile,
    getFileMetadata
} = require("../controllers/fileController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Upload file
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);

// List files
router.get("/", authMiddleware, listFiles);

// Download file
router.get("/:file_id", authMiddleware, downloadFile);

// Delete file
router.delete("/:file_id", authMiddleware, deleteFile);

// File metadata
router.get("/:file_id/metadata", authMiddleware, getFileMetadata);

module.exports = router;