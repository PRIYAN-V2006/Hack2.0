import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();

    console.log("=================================");
    console.log("✅ MySQL connected successfully");
    console.log("=================================");

    connection.release();
  } catch (error) {
    console.log("=================================");
    console.log("❌ MySQL connection failed");
    console.log("=================================");
    console.error(error.message);
  }
}

export default pool;