import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/seats/:scheduleId", async (req, res) => {
  const { scheduleId } = req.params;

  try {
    const [[schedule]] = await pool.query("SELECT bus_id FROM schedules WHERE schedule_id = ?", [scheduleId]);

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found." });
    }

    const [seats] = await pool.query(
      "SELECT seat_id, seat_number, seat_type, fare, is_available FROM seats WHERE bus_id = ? ORDER BY seat_number",
      [schedule.bus_id],
    );

    return res.json(seats);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load seats." });
  }
});

export default router;
