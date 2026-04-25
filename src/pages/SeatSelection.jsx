import React, { useEffect, useMemo } from "react";
import { FaCircle, FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import { useBooking } from "../context/BookingContext";

const buildSeatRows = (totalSeats) => {
  const rowCount = Math.ceil(totalSeats / 8);

  return Array.from({ length: rowCount }, (_, rowIndex) => {
    const start = rowIndex * 8;
    const left = Array.from({ length: 4 }, (_, i) => start + i + 1).filter((n) => n <= totalSeats);
    const right = Array.from({ length: 4 }, (_, i) => start + 4 + i + 1).filter((n) => n <= totalSeats);

    return { left, right };
  });
};

const SeatSelection = () => {
  const navigate = useNavigate();
  const { busId } = useParams();
  const { buses, selectedBus, chooseBus, selectedSeats, toggleSeat, totalPrice, trip } = useBooking();

  useEffect(() => {
    if (!selectedBus && busId) {
      const exists = buses.some((bus) => bus.id === busId);
      if (exists) {
        chooseBus(busId);
      }
    }
  }, [busId, buses, chooseBus, selectedBus]);

  const activeBus = useMemo(() => {
    if (selectedBus) {
      return selectedBus;
    }

    return buses.find((bus) => bus.id === busId) ?? null;
  }, [selectedBus, buses, busId]);

  if (!activeBus) {
    return (
      <section className="section-wrap py-16 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300">Please choose a bus first.</p>
        <button
          className="mt-3 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white"
          onClick={() => navigate("/bus")}
        >
          Go to Bus List
        </button>
      </section>
    );
  }

  const rows = buildSeatRows(activeBus.totalSeats);
  const from = trip.from || activeBus.from;
  const to = trip.to || activeBus.to;

  return (
    <section className="section-wrap py-10">
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <article>
          <img src={activeBus.image} alt={activeBus.name} className="w-full max-w-xl object-contain" />
          <h1 className="mt-5 text-4xl font-bold text-slate-900 dark:text-slate-100">Luxury Bus</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">(Bus Number Plate)</p>
          <p className="mt-2 flex items-center gap-1 text-yellow-400">
            {Array.from({ length: 5 }, (_, index) => (
              <FaStar key={index} className="text-sm" />
            ))}
            <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">({activeBus.rating})</span>
          </p>
          <p className="mt-4 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            Comfortable premium ride with charging points, spacious seats, and route tracking. Select your
            preferred seats and continue with passenger details.
          </p>
        </article>

        <article className="card-core p-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Your Destination</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-500 dark:text-slate-400">
            <p>
              From:- <span className="font-semibold text-slate-800 dark:text-slate-200">{from}</span>
            </p>
            <p>
              To:- <span className="font-semibold text-slate-800 dark:text-slate-200">{to}</span>
            </p>
            <p>
              Bus Leaving At:- <span className="font-semibold text-slate-800 dark:text-slate-200">{activeBus.departAt}</span>
            </p>
          </div>

          <h3 className="mt-8 text-2xl font-bold text-slate-900 dark:text-slate-100">Choose a Seat</h3>
          <div className="mt-4 rounded-lg border border-slate-200/70 p-3 dark:border-slate-800">
            <div className="space-y-3">
              {rows.map((row, index) => (
                <div key={index} className="grid grid-cols-[repeat(4,minmax(0,1fr))_20px_repeat(4,minmax(0,1fr))] gap-2">
                  {row.left.map((seatNo) => {
                    const isBooked = activeBus.bookedSeats.includes(seatNo);
                    const isSelected = selectedSeats.includes(seatNo);
                    return (
                      <button
                        key={seatNo}
                        onClick={() => toggleSeat(seatNo)}
                        disabled={isBooked}
                        className={`h-9 rounded-md border text-xs font-semibold transition ${
                          isBooked
                            ? "cursor-not-allowed border-red-500/70 text-red-400"
                            : isSelected
                              ? "border-violet-500 bg-violet-500/20 text-violet-300"
                              : "border-slate-400/60 text-slate-500 hover:border-violet-400"
                        }`}
                      >
                        {seatNo}
                      </button>
                    );
                  })}
                  <div />
                  {row.right.map((seatNo) => {
                    const isBooked = activeBus.bookedSeats.includes(seatNo);
                    const isSelected = selectedSeats.includes(seatNo);
                    return (
                      <button
                        key={seatNo}
                        onClick={() => toggleSeat(seatNo)}
                        disabled={isBooked}
                        className={`h-9 rounded-md border text-xs font-semibold transition ${
                          isBooked
                            ? "cursor-not-allowed border-red-500/70 text-red-400"
                            : isSelected
                              ? "border-violet-500 bg-violet-500/20 text-violet-300"
                              : "border-slate-400/60 text-slate-500 hover:border-violet-400"
                        }`}
                      >
                        {seatNo}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-2 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2">
            <p className="flex items-center gap-2"><FaCircle className="text-xs text-slate-400" /> Available</p>
            <p className="flex items-center gap-2"><FaCircle className="text-xs text-red-500" /> Booked</p>
            <p className="flex items-center gap-2"><FaCircle className="text-xs text-violet-500" /> Selected</p>
            <p className="flex items-center gap-2"><FaCircle className="text-xs text-violet-500" /> Rs. {activeBus.price}</p>
          </div>

          <div className="mt-7">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Selected Seats:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedSeats.length === 0 ? (
                <span className="text-sm text-slate-500">No seats selected</span>
              ) : (
                selectedSeats.map((seat) => (
                  <span
                    key={seat}
                    className="rounded-md border border-violet-500/50 bg-violet-500/20 px-2 py-1 text-sm font-semibold text-violet-300"
                  >
                    {seat}
                  </span>
                ))
              )}
            </div>
            <p className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">
              Total Fair Prices: <span className="text-violet-400">Rs. {totalPrice || 0}</span>
              <span className="ml-2 text-xs font-normal text-slate-500">(Including of all taxes)</span>
            </p>
            <button
              onClick={() => navigate("/checkout")}
              disabled={selectedSeats.length === 0}
              className="mt-4 w-full rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Proceed to Checkout
            </button>
          </div>
        </article>
      </div>
    </section>
  );
};

export default SeatSelection;
