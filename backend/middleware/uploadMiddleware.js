const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "storage/encrypted_files/");
    },
    filename: function (req, file, cb) {
        const fileId = uuidv4();
        req.fileId = fileId;
        cb(null, fileId + ".enc");
    }
});

const upload = multer({ storage: storage });

module.exports = upload;