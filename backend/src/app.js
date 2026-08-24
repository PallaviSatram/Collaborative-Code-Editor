const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const codeVersionRoutes = require("./routes/codeVersionRoutes");
const roomRoutes = require("./routes/roomRoutes");


const app = express();

// Middleware
const allowedOrigins = [
    "http://localhost:3000",
    process.env.FRONTEND_URL,
];

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PATCH"],
        credentials: true,
    })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/versions", codeVersionRoutes);
app.use("/api/rooms", roomRoutes);

module.exports = app;