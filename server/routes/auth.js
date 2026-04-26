import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, full_name, phone } = req.body || {};

  if (!email || !full_name) {
    return res.status(400).json({ error: "Email and full name are required." });
  }

  try {
    const [existing] = await pool.query("SELECT user_id, full_name, email, phone FROM users WHERE email = ?", [
      email,
    ]);

    if (existing.length > 0) {
      return res.json(existing[0]);
    }

    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, phone) VALUES (?, ?, ?)",
      [full_name, email, phone || null],
    );

    return res.json({
      user_id: result.insertId,
      full_name,
      email,
      phone: phone || null,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to login user." });
  }
});

export default router;
