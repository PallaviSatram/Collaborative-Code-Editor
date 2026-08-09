const { pool } = require("../config/db");

class CodeVersionModel {

    // Create a new code version
    async create({
        roomId,
        userId,
        username,
        message,
        code,
        language,
    }) {

        const query = `
            INSERT INTO code_versions (
                room_id,
                user_id,
                username,
                message,
                code,
                language
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        const result = await pool.query(query, [
            roomId,
            userId,
            username,
            message,
            code,
            language,
        ]);

        return result.rows[0];
    }


    // Get all versions of a room
    async findByRoomId(roomId) {

        const query = `
            SELECT *
            FROM code_versions
            WHERE room_id = $1
            ORDER BY created_at DESC;
        `;

        const result = await pool.query(query, [roomId]);

        return result.rows;
    }


    // Get a specific version
    async findById(versionId) {

        const query = `
            SELECT *
            FROM code_versions
            WHERE id = $1;
        `;

        const result = await pool.query(query, [versionId]);

        return result.rows[0] || null;
    }

}

module.exports = new CodeVersionModel();