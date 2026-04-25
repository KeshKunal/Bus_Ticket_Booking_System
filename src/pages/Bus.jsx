import React, { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { BUS_TYPES } from "../data/buses";
import { useBooking } from "../context/BookingContext";

const Bus = () => {
  const navigate = useNavigate();
  const { buses, chooseBus, trip, updateTrip } = useBooking();
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      buses.filter((bus) => {
        const byType = trip.busType === "All" || bus.type === trip.busType;
        const query = search.trim().toLowerCase();
        const bySearch =
          !query ||
          bus.name.toLowerCase().includes(query) ||
          bus.type.toLowerCase().includes(query) ||
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
          <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-violet-600 p-3 text-white">
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

      {filtered.length === 0 ? (
        <div className="card-core p-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">No buses match your filter.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((bus) => (
            <article
              key={bus.id}
              className="card-core cursor-pointer overflow-hidden transition hover:-translate-y-1 hover:border-violet-500/40"
              onClick={() => openBus(bus.id)}
            >
              <div className="h-[170px] bg-slate-100/70 p-3 dark:bg-slate-900/40">
                <img src={bus.image} alt={bus.name} className="h-full w-full object-contain" />
              </div>
              <div className="flex items-center justify-between p-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Tourist Bus</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{bus.totalSeats} Passengers</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Bus;
