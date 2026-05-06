import React from "react";
import { useNavigate } from "react-router-dom";

import { useBooking } from "../context/BookingContext";

const Ticket = () => {
  const navigate = useNavigate();
  const { trip, selectedBus, selectedSeats, passengerDetails, totalPrice, clearBooking, bookingSummary, user } = useBooking();

  if (!selectedBus || selectedSeats.length === 0 || !bookingSummary) {
    return (
      <section className="section-wrap py-16 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300">No booking found. Please start again.</p>
        <button onClick={() => navigate("/")} className="mt-3 rounded-md bg-teal-600 px-4 py-2 text-white">
          Back Home
        </button>
      </section>
    );
  }

  const restart = () => {
    clearBooking();
    navigate("/");
  };

  return (
    <section className="section-wrap py-12">
      <article className="mx-auto max-w-3xl rounded-xl border border-emerald-500/30 bg-white p-6 shadow-2xl dark:bg-slate-900">
        <p className="text-sm font-semibold text-emerald-600">Booking Confirmed</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">E-Ticket Summary</h1>

        <div className="mt-6 grid gap-4 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
          <p>
            Passenger Count: <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedSeats.length}</span>
          </p>
          <p>
            Email: <span className="font-semibold text-slate-900 dark:text-slate-100">{user?.email || "N/A"}</span>
          </p>
          <p>
            Phone: <span className="font-semibold text-slate-900 dark:text-slate-100">{user?.phone || "N/A"}</span>
          </p>
          <p>
            Route: <span className="font-semibold text-slate-900 dark:text-slate-100">{trip.from || selectedBus.from} to {trip.to || selectedBus.to}</span>
          </p>
          <p>
            Bus: <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedBus.name}</span>
          </p>
          <p>
            Bus Number: <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedBus.number}</span>
          </p>
          <p>
            Travel Date: <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedBus.date || trip.date || "Not available"}</span>
          </p>
          <p>
            Departure Time: <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedBus.departAt}</span>
          </p>
          <p>
            Arrival Time: <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedBus.arriveAt}</span>
          </p>
          <p>
            Seat Numbers: <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedSeats.join(", ")}</span>
          </p>
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Passenger List</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            {selectedSeats.map((seatNo) => (
              <p key={seatNo}>
                Seat {seatNo}: <span className="font-semibold text-slate-900 dark:text-slate-100">{passengerDetails[seatNo]?.name || "N/A"}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Paid</p>
          <p className="text-2xl font-extrabold text-amber-600">Rs. {totalPrice}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/bus")}
            className="rounded-md border border-emerald-500/60 px-4 py-2 text-sm font-semibold text-emerald-600"
          >
            Book Another Seat
          </button>
          <button
            onClick={restart}
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Finish
          </button>
        </div>
      </article>
    </section>
  );
};

export default Ticket;
