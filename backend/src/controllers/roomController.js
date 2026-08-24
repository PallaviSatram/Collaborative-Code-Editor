const roomService = require("../services/roomService");

class RoomController {

    async updateRoomName(req, res) {

        try {

            const { roomId } = req.params;
            const { roomName } = req.body;

            if (!roomName || !roomName.trim()) {

                return res.status(400).json({
                    message: "Room name is required.",
                });

            }

            const updatedRoom =
                await roomService.updateRoomName(
                    roomId,
                    roomName.trim()
                );

            if (!updatedRoom) {

                return res.status(404).json({
                    message: "Room not found.",
                });

            }

            return res.status(200).json({
                message: "Room name updated successfully.",
                room: updatedRoom,
            });

        } catch (error) {

            console.error(
                "❌ Update room name error:",
                error
            );

            return res.status(500).json({
                message: "Failed to update room name.",
            });

        }

    }

}

module.exports = new RoomController();