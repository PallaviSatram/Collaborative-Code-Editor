class RoomService {

  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomId) {

    if (!this.rooms.has(roomId)) {

      this.rooms.set(roomId, {
        code: "",
        language: "javascript",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    }

    return this.rooms.get(roomId);
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  getRoomState(roomId) {

    const room = this.rooms.get(roomId);

    if (!room) {
      return null;
    }

    return {
      code: room.code,
      language: room.language,
    };

  }

  updateCode(roomId, code) {

    const room = this.rooms.get(roomId);

    if (!room) return;

    room.code = code;
    room.updatedAt = new Date();
  }

  updateLanguage(roomId, language) {

    const room = this.rooms.get(roomId);

    if (!room) return;

    room.language = language;
    room.updatedAt = new Date();
  }

}

module.exports = new RoomService();