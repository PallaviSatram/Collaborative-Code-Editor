class RoomModel {

    constructor() {
        this.rooms = new Map();
    }

    create(roomId) {

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

    findByRoomId(roomId) {
        return this.rooms.get(roomId);
    }

    update(roomId, roomData) {

        this.rooms.set(roomId, roomData);

    }

}

module.exports = new RoomModel();