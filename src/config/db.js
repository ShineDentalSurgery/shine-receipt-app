const mysql = require("mysql2/promise");
require("dotenv").config();

async function initializeDatabase() {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log("Connected to MySQL database");
        return db;
    } catch (err) {
        console.error("Database connection failed:", err);
        throw err;
    }
}

module.exports = initializeDatabase;
