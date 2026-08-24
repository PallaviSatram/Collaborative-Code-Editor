const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
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