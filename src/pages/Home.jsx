import React from "react";
import { FaArrowRight, FaTicketAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import busCat1 from "../assets/bus2.png";
import busCat2 from "../assets/bus6.png";
import busCat3 from "../assets/bus9.png";
import heroBg from "../assets/bg1.jpg";
import heroBus from "../assets/bus10.png";
import { BUS_TYPES } from "../data/buses";
import { MAJOR_INDIAN_CITIES } from "../data/cities";
import { useBooking } from "../context/BookingContext";

const categories = [
  { title: "City Express", image: busCat1 },
  { title: "Luxury Coach", image: busCat2 },
  { title: "Night Rider", image: busCat3 },
];

const offers = [
  { code: "GTECH08", title: "Get up to 40% off on your booking", valid: "Valid till: 31st March" },
  { code: "FIRST20", title: "20% discount for first-time users", valid: "Valid till: 15th April" },
];

const CITY_RESULTS_LIMIT = 5;

const CityAutocompleteField = ({ label, value, placeholder, onChange, options }) => {
  const [open, setOpen] = React.useState(false);

  const matches = React.useMemo(() => {
    const query = value.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return (options || [])
      .filter((city) => city.toLowerCase().startsWith(query))
      .slice(0, CITY_RESULTS_LIMIT);
  }, [value, options]);

  const showDropdown = open && matches.length > 0;

  const handleSelect = (city) => {
    onChange(city);
    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</label>
      <input
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 120);
        }}
        placeholder={placeholder}
        className="input-core pr-4"
        autoComplete="off"
        required
      />

      {showDropdown ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-slate-950/40 dark:border-slate-700">
          <div className="max-h-[15rem] overflow-y-auto py-1">
            {matches.map((city) => (
              <button
                key={city}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(city)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-white transition hover:bg-teal-600"
              >
                <span>{city}</span>
                <span className="text-xs text-slate-400">India</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { trip, updateTrip, locations, searchBuses } = useBooking();
  const cityOptions = locations.length > 0 ? locations : MAJOR_INDIAN_CITIES;

  const handleSearch = async (event) => {
    event.preventDefault();
    await searchBuses();
    navigate("/bus");
  };

  return (
    <div className="w-full">
      <section
        className="relative min-h-[520px] overflow-hidden"
        style={{ backgroundImage: `url(${heroBg})`, backgroundPosition: "center", backgroundSize: "cover" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/75 to-slate-900/65" />
        <div className="section-wrap relative grid items-center gap-10 py-16 lg:grid-cols-2">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Reserve Your <span className="text-amber-300">Bus Tickets</span> in Minutes
            </h1>
            <p className="max-w-xl text-sm text-slate-200 sm:text-base">
              Plan your trip in minutes. Choose routes, compare buses, pick your favorite seats, and
              finish booking without leaving this app.
            </p>
            <button
              onClick={() => navigate("/bus")}
              className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-500"
            >
              Reserve Seat Now
              <FaArrowRight className="text-xs" />
            </button>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img src={heroBus} alt="Bus" className="w-full max-w-xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.45)]" />
          </div>
        </div>
      </section>

      <section className="section-wrap relative -mt-12 pb-8">
        <form
          onSubmit={handleSearch}
          className="grid gap-4 rounded-xl border border-slate-200/60 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 md:grid-cols-5"
        >
          <CityAutocompleteField
            label="From"
            value={trip.from}
            placeholder="Select pickup"
            onChange={(from) => updateTrip({ from })}
            options={cityOptions}
          />
          <CityAutocompleteField
            label="To"
            value={trip.to}
            placeholder="Select destination"
            onChange={(to) => updateTrip({ to })}
            options={cityOptions}
          />
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">Date (Optional)</label>
            <input
              type="date"
              value={trip.date}
              onChange={(event) => updateTrip({ date: event.target.value })}
              className="input-core"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">Bus Type</label>
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
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Passengers</label>
            <input
              type="number"
              value={trip.passengers}
              onChange={(event) => updateTrip({ passengers: Math.max(1, Number(event.target.value) || 1) })}
              min={1}
              max={8}
              className="input-core"
            />
            <button
              type="submit"
              className="mt-1 rounded-md bg-teal-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
            >
              Check Availability
            </button>
          </div>
        </form>
      </section>

      <section className="section-wrap py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Top Categories</h2>
          <button onClick={() => navigate("/bus")} className="text-sm font-semibold text-teal-600 hover:text-teal-500">
            View all
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((item) => (
            <div key={item.title} className="card-core p-5">
              <img src={item.image} alt={item.title} className="h-28 w-full object-contain" />
              <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="section-wrap pb-14 pt-6">
        <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">Special Offers</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {offers.map((offer) => (
            <article key={offer.code} className="card-core flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-600">
                <FaTicketAlt />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{offer.title}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-amber-600">{offer.code}</span> • {offer.valid}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
