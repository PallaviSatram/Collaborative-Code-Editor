const roomModel = require("../models/roomModel");

class RoomService {

  async createRoom(roomId) {

    return await roomModel.create(roomId);

  }

  async getRoom(roomId) {
    return await roomModel.findByRoomId(roomId);
  }

  async getRoomState(roomId) {

    const room = await roomModel.findByRoomId(roomId);

    if (!room) {
      return null;
    }

    return {
      code: room.current_code,
      language: room.current_language,
    };

  }

  async updateCode(roomId, code) {

    const room = await roomModel.findByRoomId(roomId);

    if (!room) return;

    room.current_code = code;
    room.uupdated_at = new Date();

    await roomModel.update(roomId, room);

  }

  async updateLanguage(roomId, language) {

    const room = await roomModel.findByRoomId(roomId);

    if (!room) return;

    room.current_language = language;
    room.updated_at = new Date();

    await roomModel.update(roomId, room);

  }

}

module.exports = new RoomService();