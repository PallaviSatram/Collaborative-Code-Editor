const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const codeVersionRoutes = require("./routes/codeVersionRoutes");
const roomRoutes = require("./routes/roomRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/versions", codeVersionRoutes);
app.use("/api/rooms", roomRoutes);

module.exports = app;