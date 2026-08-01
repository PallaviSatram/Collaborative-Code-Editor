require("dotenv").config();

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

socketHandler(io);

const PORT = process.env.PORT || 5000;

async function startServer() {

    await connectDB();

    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });

}

startServer();