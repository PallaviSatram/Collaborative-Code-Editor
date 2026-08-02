const { pool } = require("../config/db");

class ParticipantModel {

  async joinRoom(roomId, username) {

    const existingParticipant = await pool.query(
      `
        SELECT id
        FROM room_participants
        WHERE room_id = $1
        AND username = $2;
        `,
      [roomId, username]
    );

    if (existingParticipant.rows.length > 0) {

      await pool.query(
        `
            UPDATE room_participants
            SET
                is_online = TRUE,
                joined_at = NOW(),
                left_at = NULL
            WHERE
                room_id = $1
                AND username = $2;
            `,
        [roomId, username]
      );

      return;
    }

    await pool.query(
      `
        INSERT INTO room_participants
        (
            room_id,
            username,
            is_online
        )
        VALUES
        (
            $1,
            $2,
            TRUE
        );
        `,
      [roomId, username]
    );

  }

  async leaveRoom(roomId, username) {

    const query = `
            UPDATE room_participants
            SET
                is_online = FALSE,
                left_at = NOW()
            WHERE
                room_id = $1
                AND username = $2
                AND is_online = TRUE;
        `;

    await pool.query(query, [roomId, username]);

  }

  async getOnlineParticipants(roomId) {

    const query = `
            SELECT username
            FROM room_participants
            WHERE
                room_id = $1
                AND is_online = TRUE;
        `;

    const result = await pool.query(query, [roomId]);

    return result.rows;

  }

}

module.exports = new ParticipantModel();