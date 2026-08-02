require("dotenv").config();
const startCleanupScheduler = require("./src/utils/cleanupScheduler");
const socketAuthMiddleware = require("./src/middleware/socketAuthMiddleware");
const { connectDB } = require("./src/config/db");
const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");

const socketHandler = require("./src/sockets/socketHandler");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
io.use(socketAuthMiddleware);
socketHandler(io);

const PORT = process.env.PORT || 5000;

async function startServer() {

    await connectDB();
    startCleanupScheduler();

    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });

}

startServer();