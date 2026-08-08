const roomModel = require("../models/roomModel");

class RoomService {
  constructor() {
    this.saveTimers = new Map();
  }

  async createRoom(roomId, roomName) {
    let room = await roomModel.findByRoomId(roomId);
    if (room) {
      return room;
    }
    return await roomModel.create(
      roomId,
      roomName
    );
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
      roomName: room.room_name,
      code: room.current_code,
      language: room.current_language,
    };

  }

  async updateCode(roomId, code) {
    const room = await roomModel.findByRoomId(roomId);
    if (!room) return;
    room.current_code = code;

    if (this.saveTimers.has(roomId)) {
      clearTimeout(this.saveTimers.get(roomId));
    }
    const timer = setTimeout(async () => {
      await roomModel.update(roomId, room);
      this.saveTimers.delete(roomId);
    }, 500);
    this.saveTimers.set(roomId, timer);
  }

  async updateLanguage(roomId, language) {

    const room = await roomModel.findByRoomId(roomId);

    if (!room) return;

    room.current_language = language;

    await roomModel.update(roomId, room);

  }
  async activateRoom(roomId) {

    await roomModel.updateRoomStatus(
      roomId,
      true
    );

  }

  async deactivateRoom(roomId) {

    await roomModel.updateRoomStatus(
      roomId,
      false
    );

  }
  async cleanupInactiveRooms() {

    const deletedRooms = await roomModel.deleteInactiveRooms();

    if (deletedRooms.length > 0) {
      console.log(
        `🗑 Deleted ${deletedRooms.length} inactive room(s).`
      );
    } else {
      console.log(
        "✅ No inactive rooms to clean."
      );
    }
  }
}

module.exports = new RoomService();