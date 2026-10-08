import bcrypt from "bcryptjs";
import pool from "../config/db.js";

export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    // Check input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required."
      });
    }

    // Find user
    const [users] = await pool.execute(
      `
      SELECT
        id,
        username,
        password,
        full_name,
        register_number,
        email,
        role
      FROM users
      WHERE username = ?
      LIMIT 1
      `,
      [username.trim()]
    );

    // User not found
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password."
      });
    }

    const user = users[0];

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    // Wrong password
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password."
      });
    }

    // Login successful
    return res.status(200).json({
      success: true,
      message: "Login successful.",

      user: {
        id: user.id,
        username: user.username,
        name: user.full_name,
        registerNumber: user.register_number,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
}