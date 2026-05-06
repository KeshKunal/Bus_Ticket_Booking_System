import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password, full_name, phone } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Check if user exists
    const [existing] = await pool.query(
      "SELECT user_id, email, password, full_name, phone FROM users WHERE email = ?",
      [email],
    );

    if (existing.length > 0) {
      // User exists - validate password
      if (existing[0].password !== password) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      // Password is correct - return user data without password
      const { password: _password, ...safeUser } = existing[0];
      return res.json(safeUser);
    }

    // User doesn't exist - create new account (signup)
    // Require additional fields for signup
    if (!full_name || !phone) {
      return res.status(400).json({ 
        error: "For new accounts, full name and phone are required." 
      });
    }

    const [result] = await pool.query(
      "INSERT INTO users (email, password, full_name, phone) VALUES (?, ?, ?, ?)",
      [email, password, full_name, phone],
    );

    return res.json({
      user_id: result.insertId,
      email: email,
      full_name: full_name,
      phone: phone,
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "Email already exists." });
    }
    return res.status(500).json({ error: `Failed to process request: ${error.message}` });
  }
});

export default router;
