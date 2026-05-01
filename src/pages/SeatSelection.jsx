import React, { useEffect, useMemo } from "react";
import { FaCircle, FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import { useBooking } from "../context/BookingContext";

const sortSeatKeys = (a, b) => {
  const cleanA = String(a);
  const cleanB = String(b);
  const prefixA = cleanA.match(/^[A-Za-z]+/)?.[0] || "";
  const prefixB = cleanB.match(/^[A-Za-z]+/)?.[0] || "";
  if (prefixA !== prefixB) {
    return prefixA.localeCompare(prefixB);
  }

  const numberA = Number.parseInt(cleanA.replace(/\D+/g, ""), 10) || 0;
  const numberB = Number.parseInt(cleanB.replace(/\D+/g, ""), 10) || 0;
  return numberA - numberB;
};

const buildSeatRows = (seats) => {
  const rows = [];
  const sorted = [...seats].sort((a, b) => sortSeatKeys(a.seat_number, b.seat_number));

  for (let index = 0; index < sorted.length; index += 4) {
    const chunk = sorted.slice(index, index + 4);
    rows.push({ left: chunk.slice(0, 2), right: chunk.slice(2, 4) });
  }

  return rows;
};

const getSeatMeta = (seatData, activeBus, isSelected, isBooked) => {
  const fare = seatData?.fare || 0;
  const tax = Math.round(fare * 0.18);
  const baseFare = fare - tax;

  return {
    seatNo: seatData?.seat_number ?? "-",
    seatType: seatData?.seat_type || activeBus.type,
    baseFare,
    tax,
    totalFare: fare,
    status: isBooked ? "Booked" : isSelected ? "Selected" : "Available",
  };
};

const SeatHoverCard = ({ seatData, activeBus, isSelected, isBooked }) => {
  const meta = getSeatMeta(seatData, activeBus, isSelected, isBooked);

  return (
    <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-52 -translate-x-1/2 rounded-2xl border border-emerald-400/30 bg-slate-950/95 p-3 text-xs text-slate-100 shadow-2xl shadow-slate-950/60 ring-1 ring-white/5 group-hover:block">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
        <p className="text-sm font-semibold text-white">Seat Details</p>
        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200">
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
          <span className="font-semibold text-emerald-200">Rs. {meta.totalFare}</span>
        </div>
      </div>
    </div>
  );
};

const SeatTile = ({ seatKey, seatData, activeBus, selectedSeats, toggleSeat }) => {
  const isBooked = !seatData?.is_available;
  const isSelected = selectedSeats.includes(seatKey);

  return (
    <div className="group relative">
      <button
        onClick={() => toggleSeat(seatKey)}
        disabled={isBooked}
        className={`flex h-10 w-full items-center justify-center rounded-xl border text-xs font-semibold transition duration-200 sm:h-11 ${
          isBooked
            ? "cursor-not-allowed border-red-500/60 bg-gradient-to-br from-red-500/15 to-red-500/5 text-red-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            : isSelected
              ? "border-emerald-500 bg-gradient-to-br from-emerald-500/25 to-teal-500/20 text-emerald-100 shadow-lg shadow-emerald-500/20"
              : "border-emerald-500/60 bg-gradient-to-br from-slate-950/5 to-emerald-500/5 text-emerald-700 shadow-sm shadow-emerald-500/10 hover:-translate-y-0.5 hover:border-teal-400 hover:bg-gradient-to-br hover:from-teal-500/20 hover:to-amber-400/10 hover:text-emerald-900 hover:shadow-lg hover:shadow-emerald-500/20 dark:text-emerald-300"
        }`}
      >
        {seatData?.seat_number || seatKey}
      </button>
      <SeatHoverCard seatData={seatData} activeBus={activeBus} isSelected={isSelected} isBooked={isBooked} />
    </div>
  );
};

const SeatSelection = () => {
  const navigate = useNavigate();
  const { busId } = useParams();
  const {
    buses,
    selectedBus,
    chooseBus,
    selectedSeats,
    toggleSeat,
    totalPrice,
    trip,
    loadSeats,
    seatsForSelectedBus,
  } = useBooking();

  useEffect(() => {
    if (!selectedBus && busId) {
      const exists = buses.some((bus) => bus.id === busId);
      if (exists) {
        chooseBus(busId);
      }
    }
  }, [busId, buses, chooseBus, selectedBus]);

  useEffect(() => {
    if (selectedBus?.id) {
      loadSeats(selectedBus.id);
      return;
    }
    if (busId) {
      loadSeats(busId);
    }
  }, [selectedBus, busId, loadSeats]);

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
  const seatList = Object.values(seatsForSelectedBus);
  const lowerDeck = seatList.filter((seat) => String(seat.seat_number).toUpperCase().startsWith("L"));
  const upperDeck = seatList.filter((seat) => String(seat.seat_number).toUpperCase().startsWith("U"));
  const seaterRows = buildSeatRows(seatList);
  const lowerRows = buildSeatRows(lowerDeck);
  const upperRows = buildSeatRows(upperDeck);
  const from = trip.from || activeBus.from;
  const to = trip.to || activeBus.to;

  return (
    <section className="section-wrap py-10">
      <div className="grid items-start gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900">
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.22),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(251,191,36,0.18),_transparent_26%)]" />
            <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:18px_18px] opacity-30" />
            <div className="relative z-10 flex h-full items-end p-6 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Journey Overview</p>
                <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">{activeBus.name}</h1>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-semibold tracking-wide">
                    {activeBus.coach || activeBus.type}
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
          <div className="border-b border-slate-200/70 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 px-5 py-4 text-white dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-300">Seat Selection</p>
                <h2 className="mt-1 text-2xl font-black">Choose a Seat</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live Availability
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {Object.keys(seatsForSelectedBus).length === 0 ? (
              <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/40">
                Loading seats for this schedule. If this takes too long, refresh the page.
              </div>
            ) : null}
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
                    <span className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-600">Sleeper Coach</span>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-600">
                      Berth layout
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                        Lower Deck
                      </p>
                      <div className="space-y-3">
                        {(lowerRows.length > 0 ? lowerRows : seaterRows).map((row, index) => (
                          <div
                            key={`lower-${index}`}
                            className="grid grid-cols-[repeat(2,minmax(0,1fr))_1.75rem_repeat(2,minmax(0,1fr))] gap-2.5"
                          >
                            {row.left.map((seat) => (
                              <SeatTile
                                key={seat.seat_number}
                                seatKey={seat.seat_number}
                                seatData={seat}
                                activeBus={activeBus}
                                selectedSeats={selectedSeats}
                                toggleSeat={toggleSeat}
                              />
                            ))}

                            <div className="flex items-stretch justify-center">
                              <div className="w-full rounded-full bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
                            </div>

                            {row.right.map((seat) => (
                              <SeatTile
                                key={seat.seat_number}
                                seatKey={seat.seat_number}
                                seatData={seat}
                                activeBus={activeBus}
                                selectedSeats={selectedSeats}
                                toggleSeat={toggleSeat}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                        Upper Deck
                      </p>
                      <div className="space-y-3">
                        {(upperRows.length > 0 ? upperRows : []).map((row, index) => (
                          <div
                            key={`upper-${index}`}
                            className="grid grid-cols-[repeat(2,minmax(0,1fr))_1.75rem_repeat(2,minmax(0,1fr))] gap-2.5"
                          >
                            {row.left.map((seat) => (
                              <SeatTile
                                key={seat.seat_number}
                                seatKey={seat.seat_number}
                                seatData={seat}
                                activeBus={activeBus}
                                selectedSeats={selectedSeats}
                                toggleSeat={toggleSeat}
                              />
                            ))}

                            <div className="flex items-stretch justify-center">
                              <div className="w-full rounded-full bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
                            </div>

                            {row.right.map((seat) => (
                              <SeatTile
                                key={seat.seat_number}
                                seatKey={seat.seat_number}
                                seatData={seat}
                                activeBus={activeBus}
                                selectedSeats={selectedSeats}
                                toggleSeat={toggleSeat}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-600">Seater Coach</span>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-600">
                      Standard layout
                    </span>
                  </div>

                  <div className="space-y-3">
                    {seaterRows.map((row, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[repeat(4,minmax(0,1fr))_1.75rem_repeat(4,minmax(0,1fr))] gap-2.5"
                      >
                        {row.left.map((seat) => (
                          <SeatTile
                            key={seat.seat_number}
                            seatKey={seat.seat_number}
                            seatData={seat}
                            activeBus={activeBus}
                            selectedSeats={selectedSeats}
                            toggleSeat={toggleSeat}
                          />
                        ))}
                        <div className="flex items-center justify-center">
                          <span className="h-full min-h-10 w-full rounded-full bg-slate-200/80 dark:bg-slate-800" />
                        </div>
                        {row.right.map((seat) => (
                          <SeatTile
                            key={seat.seat_number}
                            seatKey={seat.seat_number}
                            seatData={seat}
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
                <FaCircle className="text-xs text-emerald-500" /> Selected
              </p>
              <p className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/40">
                <FaCircle className="text-xs text-amber-500" /> Fare varies by seat
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
                      className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-600"
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
                  className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:scale-[1.02] hover:from-teal-500 hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100"
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
