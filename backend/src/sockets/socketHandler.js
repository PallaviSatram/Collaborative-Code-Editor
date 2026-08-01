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

        socket.on(ACTIONS.JOIN,async ({ roomId, username }) => {

            console.log("JOIN EVENT");
            console.log("Room:", roomId);
            console.log("User:", username);

            userSocketMap[socket.id] = username;

            socket.join(roomId);
            await roomService.createRoom(roomId);

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

        socket.on(ACTIONS.CODE_CHANGE, async ({ roomId, code }) => {
            await roomService.updateCode(roomId, code);
            socket.to(roomId).emit(ACTIONS.CODE_CHANGE, {
                code,
            });

        });

        socket.on(ACTIONS.LANGUAGE_CHANGE, async ({ roomId, language }) => {
            await roomService.updateLanguage(roomId, language);
            socket.to(roomId).emit(
                ACTIONS.LANGUAGE_CHANGE,
                {
                    language,
                }
            );

        });

        socket.on(
            ACTIONS.SYNC_CODE,
            async ({ socketId, roomId }) => {

                const roomState = await roomService.getRoomState(roomId);

                if (!roomState) return;

                io.to(socketId).emit(
                    ACTIONS.SYNC_CODE,
                    roomState
                );

            }
        );

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