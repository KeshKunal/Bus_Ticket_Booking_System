import React, { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { BUS_TYPES } from "../data/buses";
import { useBooking } from "../context/BookingContext";

const Bus = () => {
  const navigate = useNavigate();
  const { buses, chooseBus, trip, updateTrip, loading, error, searchBuses } = useBooking();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (buses.length === 0 && trip.from && trip.to && trip.date) {
      searchBuses();
    }
  }, [buses.length, searchBuses, trip.from, trip.to, trip.date]);

  const filtered = useMemo(
    () =>
      buses.filter((bus) => {
        const byType = trip.busType === "All" || bus.type === trip.busType;
        const query = search.trim().toLowerCase();
        const bySearch =
          !query ||
          bus.name.toLowerCase().includes(query) ||
          bus.type.toLowerCase().includes(query) ||
          bus.coach.toLowerCase().includes(query) ||
          bus.from.toLowerCase().includes(query) ||
          bus.to.toLowerCase().includes(query);

        return byType && bySearch;
      }),
    [buses, trip.busType, search],
  );

  const openBus = (busId) => {
    chooseBus(busId);
    navigate(`/bus/${busId}`);
  };

  return (
    <section className="section-wrap py-10">
      <div className="card-core mb-6 grid gap-4 p-4 md:grid-cols-3">
        <label className="relative md:col-span-2">
          <span className="sr-only">Search bus</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search Bus"
            className="input-core w-full pr-11"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-teal-600 p-3 text-white">
            <FaSearch className="text-xs" />
          </span>
        </label>

        <select
          value={trip.busType}
          onChange={(event) => updateTrip({ busType: event.target.value })}
          className="input-core"
        >
          {BUS_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="card-core p-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">Loading buses...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-core p-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {error || "No buses match your filter. Try a new search."}
          </p>
          <button
            onClick={searchBuses}
            className="mt-4 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Refresh Search
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((bus) => (
            <article
              key={bus.id}
              className="card-core cursor-pointer overflow-hidden transition hover:-translate-y-1 hover:border-teal-500/40"
              onClick={() => openBus(bus.id)}
            >
              <div className="h-[170px] bg-slate-100/70 p-3 dark:bg-slate-900/40">
                <img src={bus.image} alt={bus.name} className="h-full w-full object-contain" />
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{bus.name}</h3>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-700">
                    {bus.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{bus.from} - {bus.to}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Coach: {bus.coach}</p>
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                  <span>Depart: {bus.departAt}</span>
                  <span>Arrive: {bus.arriveAt}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{bus.totalSeats} Seats · {bus.number}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Bus;
