const { pool } = require("../config/db");

class RoomModel {

    async create(roomId, roomName) {
        const query = `
        INSERT INTO rooms (
            room_id,
            room_name
        )
        VALUES ($1, $2)
        ON CONFLICT (room_id)
        DO NOTHING
        RETURNING *;
    `;
        await pool.query(query, [
            roomId,
            roomName,
        ]);
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
            room_name = $1,
            current_code = $2,
            current_language = $3,
            updated_at = NOW()
        WHERE room_id = $4;
    `;

        await pool.query(query, [
            roomData.room_name,
            roomData.current_code,
            roomData.current_language,
            roomId,
        ]);

    }
    async updateRoomStatus(roomId, isActive) {

        const query = `
        UPDATE rooms
        SET
            is_active = $1,
            last_active_at = NOW()
        WHERE room_id = $2;
    `;

        await pool.query(
            query,
            [
                isActive,
                roomId,
            ]
        );

    }
    async deleteInactiveRooms() {

        const query = `
        DELETE FROM rooms
        WHERE
            is_active = FALSE
            AND last_active_at < NOW() - INTERVAL '1 month'
        RETURNING room_id;
    `;

        const result = await pool.query(query);

        return result.rows;

    }

}

module.exports = new RoomModel();