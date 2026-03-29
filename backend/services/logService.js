const CryptoJS = require("crypto-js");
const Log = require("../models/Log");

const createLog = async (userId, action, details) => {
    try {
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

        await Log.create({
            encryptedLogData: encryptedLog,
            userId,
            action
        });

    } catch (error) {
        console.error("Log error:", error);
    }
};

module.exports = createLog;