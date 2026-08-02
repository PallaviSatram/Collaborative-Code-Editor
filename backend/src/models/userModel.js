const { pool } = require("../config/db");

class UserModel {

    async createUser(user) {

        const query = `
            INSERT INTO users
            (
                id,
                username,
                email,
                password_hash
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            RETURNING
                id,
                username,
                email,
                created_at;
        `;

        const result = await pool.query(query, [
            user.id,
            user.username,
            user.email,
            user.password_hash,
        ]);

        return result.rows[0];
    }

    async findByEmail(email) {

        const query = `
            SELECT *
            FROM users
            WHERE email = $1;
        `;

        const result = await pool.query(query, [email]);

        return result.rows[0] || null;
    }

    async findByUsername(username) {

        const query = `
            SELECT *
            FROM users
            WHERE username = $1;
        `;

        const result = await pool.query(query, [username]);

        return result.rows[0] || null;
    }

    async findById(id) {

        const query = `
            SELECT
                id,
                username,
                email,
                created_at
            FROM users
            WHERE id = $1;
        `;

        const result = await pool.query(query, [id]);

        return result.rows[0] || null;
    }

}

module.exports = new UserModel();