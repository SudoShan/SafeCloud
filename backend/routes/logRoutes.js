const express = require("express");
const router = express.Router();

const {
    createLogEntry,
    getAllLogs,
    getLogById
} = require("../controllers/logController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Create log (can be internal or admin)
router.post("/log", authMiddleware, createLogEntry);

// Only admin can view logs
router.get("/logs", authMiddleware, adminMiddleware, getAllLogs);
router.get("/logs/:id", authMiddleware, adminMiddleware, getLogById);

module.exports = router;