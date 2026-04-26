import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/locations", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT location_id, city_name, state FROM locations ORDER BY city_name");
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load locations." });
  }
});

router.get("/search", async (req, res) => {
  const { origin, destination, date } = req.query || {};

  if (!origin || !destination || !date) {
    return res.status(400).json({ error: "Origin, destination, and date are required." });
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT
        s.schedule_id,
        s.departure_time,
        s.arrival_time,
        b.bus_id,
        b.bus_number,
        b.capacity,
        b.bus_type,
        o.city_name AS origin_city,
        d.city_name AS destination_city
      FROM schedules s
      JOIN buses b ON s.bus_id = b.bus_id
      JOIN locations o ON s.origin_id = o.location_id
      JOIN locations d ON s.destination_id = d.location_id
      WHERE o.city_name = ?
        AND d.city_name = ?
        AND DATE(s.departure_time) = ?
      ORDER BY s.departure_time ASC
      `,
      [origin, destination, date],
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Failed to search schedules." });
  }
});

export default router;
