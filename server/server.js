import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import searchRoutes from "./routes/search.js";
import seatRoutes from "./routes/seats.js";
import bookingRoutes from "./routes/booking.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Bus Ticket Booking API" });
});

app.use(authRoutes);
app.use(searchRoutes);
app.use(seatRoutes);
app.use(bookingRoutes);

app.use((err, _req, res, _next) => {
  res.status(500).json({ error: "Unexpected server error." });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
