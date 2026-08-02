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

}

module.exports = new ParticipantService();