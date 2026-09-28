import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create a connection pool for better scalability

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port:process.env.PORT || 8000,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
export const connectDB = async () => {
  try {
    console.log(process.env.DB_NAME)
    const connection = await pool.getConnection();
    console.log("✅ MySQL connected successfully");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL connection error:", error.message);
    process.exit(1);
  }
};