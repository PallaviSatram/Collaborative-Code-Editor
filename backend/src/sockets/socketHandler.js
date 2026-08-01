const ACTIONS = require("../constants/Actions");
const roomService = require("../services/roomService");

const userSocketMap = {};

function socketHandler(io) {

    function getAllConnectedClients(roomId) {
        return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
            (socketId) => ({
                socketId,
                username: userSocketMap[socketId],
            })
        );
    }

    io.on("connection", (socket) => {

        console.log("Socket connected", socket.id);

        socket.on(ACTIONS.JOIN, ({ roomId, username }) => {

            console.log("JOIN EVENT");
            console.log("Room:", roomId);
            console.log("User:", username);

            userSocketMap[socket.id] = username;

            socket.join(roomId);
            roomService.createRoom(roomId);

            console.log("Rooms after join:", socket.rooms);

            const clients = getAllConnectedClients(roomId);

            clients.forEach(({ socketId }) => {
                io.to(socketId).emit(ACTIONS.JOINED, {
                    clients,
                    username,
                    socketId: socket.id,
                });
            });

        });

        socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
            roomService.updateCode(roomId, code);
            socket.to(roomId).emit(ACTIONS.CODE_CHANGE, {
                code,
            });

        });

        socket.on(ACTIONS.LANGUAGE_CHANGE, ({ roomId, language }) => {
            roomService.updateLanguage(roomId, language);
            socket.to(roomId).emit(
                ACTIONS.LANGUAGE_CHANGE,
                {
                    language,
                }
            );

        });

        socket.on(ACTIONS.SYNC_CODE, ({ socketId, code, language }) => {

            io.to(socketId).emit(
                ACTIONS.SYNC_CODE,
                {
                    code,
                    language,
                }
            );

        });

        socket.on("disconnecting", () => {

            const rooms = [...socket.rooms];

            rooms.forEach((roomId) => {

                socket.to(roomId).emit(
                    ACTIONS.DISCONNECTED,
                    {
                        socketId: socket.id,
                        username: userSocketMap[socket.id],
                    }
                );

            });

            delete userSocketMap[socket.id];

            socket.leave();

        });

    });

}

module.exports = socketHandler;