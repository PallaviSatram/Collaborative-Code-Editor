const { pool } = require("../config/db");

class RoomModel {

    async create(roomId) {

        const query = `
            INSERT INTO rooms (room_id)
            VALUES ($1)
            ON CONFLICT (room_id)
            DO NOTHING
            RETURNING *;
        `;

        await pool.query(query, [roomId]);

        return this.findByRoomId(roomId);
    }

    async findByRoomId(roomId) {

        const query = `
            SELECT *
            FROM rooms
            WHERE room_id = $1;
        `;

        const result = await pool.query(query, [roomId]);

        return result.rows[0] || null;
    }

    async update(roomId, roomData) {

        const query = `
            UPDATE rooms
            SET
                current_code = $1,
                current_language = $2,
                updated_at = NOW()
            WHERE room_id = $3;
        `;

        await pool.query(query, [
            roomData.current_code,
            roomData.current_language,
            roomId,
        ]);

    }

}

module.exports = new RoomModel();