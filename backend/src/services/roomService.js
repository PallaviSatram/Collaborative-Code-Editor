const roomModel = require("../models/roomModel");

class RoomService {

  createRoom(roomId) {

    return roomModel.create(roomId);

  }

  getRoom(roomId) {
    return roomModel.findByRoomId(roomId);
  }

  getRoomState(roomId) {

    const room = roomModel.findByRoomId(roomId);

    if (!room) {
      return null;
    }

    return {
      code: room.code,
      language: room.language,
    };

  }

  updateCode(roomId, code) {

    const room = roomModel.findByRoomId(roomId);

    if (!room) return;

    room.code = code;
    room.updatedAt = new Date();

    roomModel.update(roomId, room);

  }

  updateLanguage(roomId, language) {

    const room = roomModel.findByRoomId(roomId);

    if (!room) return;

    room.language = language;
    room.updatedAt = new Date();

    roomModel.update(roomId, room);

}

}

module.exports = new RoomService();