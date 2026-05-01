import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password, email, full_name, phone } = req.body || {};
  const identifier = username || email;

  if (!identifier) {
    return res.status(400).json({ error: "Username is required." });
  }

  try {
    const [usernameColumns] = await pool.query("SHOW COLUMNS FROM users LIKE 'username'");
    const [passwordColumns] = await pool.query("SHOW COLUMNS FROM users LIKE 'password'");
    const hasUsername = usernameColumns.length > 0;
    const hasPassword = passwordColumns.length > 0;
    const identifierColumn = hasUsername ? "username" : "email";

    const [existing] = await pool.query(
      `SELECT user_id, full_name, email, phone${hasUsername ? ", username" : ""}${
        hasPassword ? ", password" : ""
      } FROM users WHERE ${identifierColumn} = ?`,
      [identifier],
    );

    if (existing.length > 0) {
      if (hasPassword && existing[0].password !== password) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const { password: _password, ...safeUser } = existing[0];
      return res.json(safeUser);
    }

    const resolvedFullName = full_name || identifier;
    const resolvedEmail = email || (hasUsername ? null : identifier);

    if (hasUsername && hasPassword) {
      const [result] = await pool.query(
        "INSERT INTO users (username, password, full_name, email, phone) VALUES (?, ?, ?, ?, ?)",
        [identifier, password || null, resolvedFullName, resolvedEmail, phone || null],
      );

      return res.json({
        user_id: result.insertId,
        username: identifier,
        full_name: resolvedFullName,
        email: resolvedEmail,
        phone: phone || null,
      });
    }

    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, phone) VALUES (?, ?, ?)",
      [resolvedFullName, resolvedEmail, phone || null],
    );

    return res.json({
      user_id: result.insertId,
      full_name: resolvedFullName,
      email: resolvedEmail,
      phone: phone || null,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to login user." });
  }
});

export default router;
