const ACTIONS = require("../constants/Actions");
const roomService = require("../services/roomService");
const participantService = require("../services/participantService");

const connectedUsers = {};

function socketHandler(io) {

    function getAllConnectedClients(roomId) {

        return Array.from(
            io.sockets.adapter.rooms.get(roomId) || []
        ).map((socketId) => ({
            socketId,
            id: connectedUsers[socketId]?.id,
            username: connectedUsers[socketId]?.username,
            email: connectedUsers[socketId]?.email,
        }));

    }

    io.on("connection", (socket) => {

        console.log("Socket connected", socket.id);

        socket.on(ACTIONS.JOIN, async ({ roomId, roomName }) => {

            const username = socket.user.username;

            // console.log("JOIN EVENT");
            // console.log("Room:", roomId);
            // console.log("User:", username);

            connectedUsers[socket.id] = {
                id: socket.user.id,
                username: socket.user.username,
                email: socket.user.email,
            };

            socket.join(roomId);
            await roomService.createRoom(
                roomId,
                roomName
            );
            await participantService.joinRoom(roomId, username);

            await roomService.activateRoom(roomId);

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

        socket.on("disconnecting", async () => {

            const rooms = [...socket.rooms];

            for (const roomId of rooms) {

                socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                    socketId: socket.id,
                    username: connectedUsers[socket.id]?.username,
                });

                if (roomId !== socket.id) {

                    await participantService.leaveRoom(
                        roomId,
                        connectedUsers[socket.id]
                    );

                    const room = io.sockets.adapter.rooms.get(roomId);

                    if (!room || room.size === 1) {

                        await roomService.deactivateRoom(roomId);

                    }

                }

            }

            delete connectedUsers[socket.id];

            socket.leave();

        });

    });

}

module.exports = socketHandler;