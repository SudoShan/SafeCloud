const CryptoJS = require("crypto-js");
const Log = require("../models/Log");

// POST /api/log → Create log entry manually
const createLogEntry = async (req, res) => {
    try {
        const { action, details } = req.body;
        const userId = req.user._id;

        const logData = {
            userId,
            action,
            details,
            timestamp: new Date()
        };

        const encryptedLog = CryptoJS.AES.encrypt(
            JSON.stringify(logData),
            process.env.ADMIN_LOG_KEY
        ).toString();

        const log = await Log.create({
            encryptedLogData: encryptedLog,
            userId,
            action
        });

        res.status(201).json({
            message: "Log created",
            logId: log._id
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/logs → Get all logs (admin)
const getAllLogs = async (req, res) => {
    try {
        const logs = await Log.find().sort({ timestamp: -1 });

        const decryptedLogs = logs.map(log => {
            const bytes = CryptoJS.AES.decrypt(
                log.encryptedLogData,
                process.env.ADMIN_LOG_KEY
            );
            const decryptedData = JSON.parse(
                bytes.toString(CryptoJS.enc.Utf8)
            );

            return {
                logId: log._id,
                data: decryptedData
            };
        });

        res.json(decryptedLogs);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/logs/:id → Get specific log
const getLogById = async (req, res) => {
    try {
        const log = await Log.findById(req.params.id);

        if (!log) {
            return res.status(404).json({ message: "Log not found" });
        }

        const bytes = CryptoJS.AES.decrypt(
            log.encryptedLogData,
            process.env.ADMIN_LOG_KEY
        );

        const decryptedData = JSON.parse(
            bytes.toString(CryptoJS.enc.Utf8)
        );

        res.json({
            logId: log._id,
            data: decryptedData
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createLogEntry,
    getAllLogs,
    getLogById
};