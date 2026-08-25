const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const codeVersionRoutes = require("./routes/codeVersionRoutes");
const roomRoutes = require("./routes/roomRoutes");


const app = express();

// Middleware
const allowedOrigins = [
  'https://collaborative-code-editor-eight-blush.vercel.app',
  'http://localhost:3000' // keep for local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // important if you're using cookies/JWT in headers
}));

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