const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const executeRoutes = require("./routes/executeRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/execute", executeRoutes);

module.exports = app;