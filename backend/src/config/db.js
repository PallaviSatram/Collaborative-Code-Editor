const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function connectDB() {
    try {

        const client = await pool.connect();

        console.log("✅ PostgreSQL Connected");

        client.release();

    } catch (error) {

        console.error("❌ PostgreSQL Connection Failed");

        console.error(error);

        process.exit(1);

    }
}

module.exports = {
    pool,
    connectDB,
};