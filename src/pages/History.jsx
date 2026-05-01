import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useBooking } from "../context/BookingContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const History = () => {
  const navigate = useNavigate();
  const { user } = useBooking();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user.user_id) {
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/bookings/${user.user_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }
        const data = await response.json();
        setRows(data);
      } catch (err) {
        setError("Unable to load booking history.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user.user_id]);

  if (!user.user_id) {
    return (
      <section className="section-wrap py-12 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300">Please login to view booking history.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Go to Login
        </button>
      </section>
    );
  }

  return (
    <section className="section-wrap py-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Booking History</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Your most recent journeys are listed below.</p>
      </div>

      {loading ? (
        <div className="card-core p-6 text-center text-sm text-slate-600 dark:text-slate-300">Loading...</div>
      ) : error ? (
        <div className="card-core p-6 text-center text-sm text-red-500">{error}</div>
      ) : rows.length === 0 ? (
        <div className="card-core p-6 text-center text-sm text-slate-600 dark:text-slate-300">
          No bookings found.
        </div>
      ) : (
        <div className="grid gap-4">
          {rows.map((row) => (
            <article key={row.booking_id} className="card-core p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {row.origin_city} - {row.destination_city}
                </h2>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                  {row.status}
                </span>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                <p>Bus: {row.bus_number} ({row.bus_type})</p>
                <p>Seat: {row.seat_number}</p>
                <p>Passenger: {row.passenger_name}</p>
                <p>Fare: Rs. {row.fare}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default History;
