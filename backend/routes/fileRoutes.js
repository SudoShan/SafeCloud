const express = require("express");
const router = express.Router();

const { uploadFile } = require("../controllers/fileController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post(
    "/upload",
    authMiddleware,
    upload.single("file"),
    uploadFile
);

module.exports = router;