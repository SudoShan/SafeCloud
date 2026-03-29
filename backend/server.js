const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
// auth
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

//key
const keyRoutes = require("./routes/keyRoutes");

app.use("/api", keyRoutes);

//file
const fileRoutes = require("./routes/fileRoutes");
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
    res.send("Secure Cloud Storage API Running");
});

//log
const logRoutes = require("./routes/logRoutes");
app.use("/api", logRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});