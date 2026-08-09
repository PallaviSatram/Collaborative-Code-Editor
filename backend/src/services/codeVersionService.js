const codeVersionModel = require("../models/codeVersionModel");

class CodeVersionService {

    // Save a new code version
    async createVersion({
        roomId,
        userId,
        username,
        message,
        code,
        language,
    }) {

        return await codeVersionModel.create({
            roomId,
            userId,
            username,
            message,
            code,
            language,
        });

    }


    // Get all versions for a room
    async getRoomVersions(roomId) {

        return await codeVersionModel.findByRoomId(roomId);

    }


    // Get one specific version
    async getVersion(versionId) {

        return await codeVersionModel.findById(versionId);

    }

}

module.exports = new CodeVersionService();