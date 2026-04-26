import React, { useEffect, useMemo } from "react";
import { FaCircle, FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import { useBooking } from "../context/BookingContext";

const buildSeaterRows = (totalSeats) => {
  const rowCount = Math.ceil(totalSeats / 8);

  return Array.from({ length: rowCount }, (_, rowIndex) => {
    const start = rowIndex * 8;
    const left = Array.from({ length: 4 }, (_, i) => start + i + 1).filter((n) => n <= totalSeats);
    const right = Array.from({ length: 4 }, (_, i) => start + 4 + i + 1).filter((n) => n <= totalSeats);

    return { left, right };
  });
};

const buildSleeperRows = (totalSeats) => {
  const rowCount = Math.ceil(totalSeats / 4);

  return Array.from({ length: rowCount }, (_, rowIndex) => {
    const start = rowIndex * 4;

    return {
      left: Array.from({ length: 2 }, (_, i) => start + i + 1).filter((n) => n <= totalSeats),
      right: Array.from({ length: 2 }, (_, i) => start + 2 + i + 1).filter((n) => n <= totalSeats),
    };
  });
};

const getSeatMeta = (seatNo, activeBus, isSelected, isBooked) => {
  const tax = Math.round(activeBus.price * 0.18);
  const baseFare = activeBus.price - tax;

  return {
    seatNo,
    seatType: activeBus.type,
    baseFare,
    tax,
    totalFare: activeBus.price,
    status: isBooked ? "Booked" : isSelected ? "Selected" : "Available",
  };
};

const SeatHoverCard = ({ seatNo, activeBus, isSelected, isBooked }) => {
  const meta = getSeatMeta(seatNo, activeBus, isSelected, isBooked);

  return (
    <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-52 -translate-x-1/2 rounded-2xl border border-violet-400/30 bg-slate-950/95 p-3 text-xs text-slate-100 shadow-2xl shadow-slate-950/60 ring-1 ring-white/5 group-hover:block">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
        <p className="text-sm font-semibold text-white">Seat Details</p>
        <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-300">
          {meta.status}
        </span>
      </div>
      <div className="mt-2 space-y-1 text-slate-300">
        <div className="flex justify-between gap-3">
          <span>Seat No</span>
          <span className="font-semibold text-white">{meta.seatNo}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Seat Type</span>
          <span className="font-semibold text-white">{meta.seatType}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Base Fare</span>
          <span className="font-semibold text-white">Rs. {meta.baseFare}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span>GST</span>
          <span className="font-semibold text-white">Rs. {meta.tax}</span>
        </div>
        <div className="flex justify-between gap-3 border-t border-white/10 pt-1">
          <span>Total</span>
          <span className="font-semibold text-violet-300">Rs. {meta.totalFare}</span>
        </div>
      </div>
    </div>
  );
};

const SeatTile = ({ seatNo, activeBus, selectedSeats, toggleSeat }) => {
  const isBooked = activeBus.bookedSeats.includes(seatNo);
  const isSelected = selectedSeats.includes(seatNo);

  return (
    <div className="group relative">
      <button
        onClick={() => toggleSeat(seatNo)}
        disabled={isBooked}
        className={`flex h-10 w-full items-center justify-center rounded-xl border text-xs font-semibold transition duration-200 sm:h-11 ${
          isBooked
            ? "cursor-not-allowed border-red-500/60 bg-gradient-to-br from-red-500/15 to-red-500/5 text-red-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            : isSelected
              ? "border-violet-500 bg-gradient-to-br from-violet-500/25 to-fuchsia-500/15 text-violet-100 shadow-lg shadow-violet-500/20"
              : "border-emerald-500/60 bg-gradient-to-br from-slate-950/5 to-emerald-500/5 text-emerald-700 shadow-sm shadow-emerald-500/10 hover:-translate-y-0.5 hover:border-violet-400 hover:bg-gradient-to-br hover:from-violet-500/20 hover:to-fuchsia-500/10 hover:text-violet-100 hover:shadow-lg hover:shadow-violet-500/20 dark:text-emerald-300"
        }`}
      >
        {seatNo}
      </button>
      <SeatHoverCard seatNo={seatNo} activeBus={activeBus} isSelected={isSelected} isBooked={isBooked} />
    </div>
  );
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

  const isSleeper = activeBus.type === "Sleeper";
  const rows = isSleeper ? buildSleeperRows(activeBus.totalSeats) : buildSeaterRows(activeBus.totalSeats);
  const from = trip.from || activeBus.from;
  const to = trip.to || activeBus.to;

  return (
    <section className="section-wrap py-10">
      <div className="grid items-start gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900">
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(168,85,247,0.28),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.18),_transparent_26%)]" />
            <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:18px_18px] opacity-30" />
            <div className="relative z-10 flex h-full items-end p-6 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">Journey Overview</p>
                <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">{activeBus.name}</h1>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-semibold tracking-wide">
                    {activeBus.type} Coach
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-semibold tracking-wide">
                    {activeBus.totalSeats} Seats
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-semibold tracking-wide">
                    {activeBus.rating} Rating
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">From</p>
              <p className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">{from}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">To</p>
              <p className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">{to}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Departing</p>
              <p className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">{activeBus.departAt}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Arriving</p>
              <p className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">{activeBus.arriveAt}</p>
            </div>
          </div>

          <div className="px-6 pb-6">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              Comfortable premium ride with charging points, route tracking, and reserved seating. Choose your
              preferred berth or seat and continue to checkout.
            </p>
          </div>
        </article>

        <article className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200/70 bg-gradient-to-r from-slate-950 via-slate-900 to-violet-950 px-5 py-4 text-white dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-300">Seat Selection</p>
                <h2 className="mt-1 text-2xl font-black">Choose a Seat</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live Availability
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              <span>{isSleeper ? "Sleeper Coach" : "Seater Coach"}</span>
              <span>Tap a seat to select</span>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 shadow-inner dark:border-slate-800 dark:bg-slate-950/40">
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-500">Front</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Driver cabin</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  Safe seating layout
                </div>
              </div>

              {isSleeper ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.28em] text-violet-500">Sleeper Coach</span>
                    <span className="rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-violet-500">
                      Berth layout
                    </span>
                  </div>

                  <div className="space-y-3">
                    {rows.map((row, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[repeat(2,minmax(0,1fr))_1.75rem_repeat(2,minmax(0,1fr))] gap-2.5"
                      >
                        {row.left.map((seatNo) => (
                          <SeatTile
                            key={seatNo}
                            seatNo={seatNo}
                            activeBus={activeBus}
                            selectedSeats={selectedSeats}
                            toggleSeat={toggleSeat}
                          />
                        ))}

                        <div className="flex items-stretch justify-center">
                          <div className="w-full rounded-full bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
                        </div>

                        {row.right.map((seatNo) => (
                          <SeatTile
                            key={seatNo}
                            seatNo={seatNo}
                            activeBus={activeBus}
                            selectedSeats={selectedSeats}
                            toggleSeat={toggleSeat}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.28em] text-violet-500">Seater Coach</span>
                    <span className="rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-violet-500">
                      Standard layout
                    </span>
                  </div>

                  <div className="space-y-3">
                    {rows.map((row, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[repeat(4,minmax(0,1fr))_1.75rem_repeat(4,minmax(0,1fr))] gap-2.5"
                      >
                        {row.left.map((seatNo) => (
                          <SeatTile
                            key={seatNo}
                            seatNo={seatNo}
                            activeBus={activeBus}
                            selectedSeats={selectedSeats}
                            toggleSeat={toggleSeat}
                          />
                        ))}
                        <div className="flex items-center justify-center">
                          <span className="h-full min-h-10 w-full rounded-full bg-slate-200/80 dark:bg-slate-800" />
                        </div>
                        {row.right.map((seatNo) => (
                          <SeatTile
                            key={seatNo}
                            seatNo={seatNo}
                            activeBus={activeBus}
                            selectedSeats={selectedSeats}
                            toggleSeat={toggleSeat}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2 xl:grid-cols-4">
              <p className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/40">
                <FaCircle className="text-xs text-emerald-500" /> Available
              </p>
              <p className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/40">
                <FaCircle className="text-xs text-red-500" /> Booked
              </p>
              <p className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/40">
                <FaCircle className="text-xs text-violet-500" /> Selected
              </p>
              <p className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/40">
                <FaCircle className="text-xs text-violet-500" /> Rs. {activeBus.price}
              </p>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Selected Seats</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Hover seats for fare details</p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedSeats.length === 0 ? (
                  <span className="text-sm text-slate-500">No seats selected</span>
                ) : (
                  selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm font-semibold text-violet-300"
                    >
                      Seat {seat}
                    </span>
                  ))
                )}
              </div>

              <div className="mt-5 flex items-end justify-between gap-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    Total Fare
                  </p>
                  <p className="mt-1 text-3xl font-black text-slate-900 dark:text-slate-100">Rs. {totalPrice || 0}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Includes applicable taxes</p>
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  disabled={selectedSeats.length === 0}
                  className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:scale-[1.02] hover:from-violet-500 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default SeatSelection;
