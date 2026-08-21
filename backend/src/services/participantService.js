const participantModel = require("../models/participantModel");

class ParticipantService {

    async joinRoom(roomId, username) {

        await participantModel.joinRoom(roomId, username);

    }

    async leaveRoom(roomId, username) {

        await participantModel.leaveRoom(roomId, username);

    }

    async getOnlineParticipants(roomId) {

        return await participantModel.getOnlineParticipants(roomId);

    }

    async getRecentRooms(
        username,
        limit = 5,
        offset = 0
    ) {

        return await participantModel.getRecentRooms(
            username,
            limit,
            offset
        );

    }

}

module.exports = new ParticipantService();