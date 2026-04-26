import express from "express";
import { pool, withTransaction } from "../db.js";

const router = express.Router();

router.post("/book", async (req, res) => {
  const { user_id, schedule_id, seats } = req.body || {};

  if (!user_id || !schedule_id || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ error: "User, schedule, and seats are required." });
  }

  try {
    const result = await withTransaction(async (connection) => {
      const bookings = [];

      for (const seat of seats) {
        const { seat_id, passenger } = seat || {};
        if (!seat_id || !passenger?.name || !passenger?.age || !passenger?.sex) {
          throw new Error("Missing passenger details.");
        }

        const [[seatRow]] = await connection.query(
          "SELECT seat_id, is_available FROM seats WHERE seat_id = ? FOR UPDATE",
          [seat_id],
        );

        if (!seatRow) {
          throw new Error("Seat not found.");
        }

        if (!seatRow.is_available) {
          throw new Error("Seat already booked.");
        }

        const [passengerResult] = await connection.query(
          "INSERT INTO passengers (name, age, sex) VALUES (?, ?, ?)",
          [passenger.name, Number(passenger.age), passenger.sex],
        );

        const [bookingResult] = await connection.query(
          "INSERT INTO bookings (user_id, pid, schedule_id, seat_id) VALUES (?, ?, ?, ?)",
          [user_id, passengerResult.insertId, schedule_id, seat_id],
        );

        await connection.query("UPDATE seats SET is_available = FALSE WHERE seat_id = ?", [seat_id]);

        bookings.push({ booking_id: bookingResult.insertId, seat_id, pid: passengerResult.insertId });
      }

      return bookings;
    });

    return res.json({ success: true, bookings: result });
  } catch (error) {
    const message = error.message || "Failed to complete booking.";
    const status = message === "Seat already booked." ? 409 : 400;
    return res.status(status).json({ error: message });
  }
});

router.get("/bookings/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT
        b.booking_id,
        b.status,
        b.booking_date,
        p.name AS passenger_name,
        p.age AS passenger_age,
        p.sex AS passenger_sex,
        s.seat_number,
        s.fare,
        sch.departure_time,
        sch.arrival_time,
        bus.bus_number,
        bus.bus_type,
        o.city_name AS origin_city,
        d.city_name AS destination_city
      FROM bookings b
      JOIN passengers p ON b.pid = p.pid
      JOIN seats s ON b.seat_id = s.seat_id
      JOIN schedules sch ON b.schedule_id = sch.schedule_id
      JOIN buses bus ON sch.bus_id = bus.bus_id
      JOIN locations o ON sch.origin_id = o.location_id
      JOIN locations d ON sch.destination_id = d.location_id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC
      `,
      [userId],
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch booking history." });
  }
});

export default router;
