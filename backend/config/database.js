require("dotenv").config();

const mysql = require("mysql2");

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "bidvault",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        console.error(
            "Check your MySQL settings in the .env file or create the database using backend/schema.sql."
        );
        return;
    }

    console.log("MySQL database connected successfully!");
});

module.exports = db;