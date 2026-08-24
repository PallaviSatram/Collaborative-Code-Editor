const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const codeVersionRoutes = require("./routes/codeVersionRoutes");
const roomRoutes = require("./routes/roomRoutes");


const app = express();

// Middleware
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.json({
        message: "SyncCode API is running 🚀"
    });
});
app.use("/api/auth", authRoutes);
app.use("/api/versions", codeVersionRoutes);
app.use("/api/rooms", roomRoutes);

module.exports = app;