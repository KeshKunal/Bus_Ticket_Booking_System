import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useBooking } from "../context/BookingContext";

const Checkout = () => {
  const navigate = useNavigate();
  const {
    trip,
    selectedBus,
    selectedSeats,
    passenger,
    updatePassenger,
    totalPrice,
    user,
    passengerDetails,
    updatePassengerDetail,
    bookSeats,
    loading,
    error,
  } = useBooking();

  if (!selectedBus || selectedSeats.length === 0) {
    return (
      <section className="section-wrap py-16 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300">Please select a bus and seats before checkout.</p>
        <button
          className="mt-3 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white"
          onClick={() => navigate("/bus")}
        >
          Choose Bus
        </button>
      </section>
    );
  }

  const from = trip.from || selectedBus.from;
  const to = trip.to || selectedBus.to;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await bookSeats();
    if (result) {
      navigate("/ticket");
    }
  };

  return (
    <section className="section-wrap py-10">
      <div className="grid items-start gap-8 lg:grid-cols-[1.35fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Passenger Information</h1>

          {!user.user_id ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              Please login before completing payment.
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="ml-3 rounded-md bg-amber-500 px-3 py-1 text-xs font-semibold text-white"
              >
                Go to Login
              </button>
            </div>
          ) : null}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Primary Contact</label>
            <input
              className="input-core"
              placeholder="e.g. G-Tech Official"
              value={passenger.fullName}
              onChange={(event) => updatePassenger({ fullName: event.target.value })}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              className="input-core"
              placeholder="e.g. example@mail.com"
              value={passenger.email}
              onChange={(event) => updatePassenger({ email: event.target.value })}
            />
            <p className="mt-1 text-xs text-slate-500">Use your login email for consistency.</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Phone</label>
            <input
              className="input-core"
              placeholder="e.g. +91 12345 67890"
              value={passenger.phone}
              onChange={(event) => updatePassenger({ phone: event.target.value })}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Alternative Phone</label>
            <input
              className="input-core"
              placeholder="e.g. +91 98765 43210"
              value={passenger.altPhone}
              onChange={(event) => updatePassenger({ altPhone: event.target.value })}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Passenger Details</h2>
            {selectedSeats.map((seatNo) => (
              <div key={seatNo} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Seat {seatNo}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <input
                    className="input-core"
                    placeholder="Name"
                    value={passengerDetails[seatNo]?.name || ""}
                    onChange={(event) => updatePassengerDetail(seatNo, { name: event.target.value })}
                    required
                  />
                  <input
                    type="number"
                    className="input-core"
                    placeholder="Age"
                    value={passengerDetails[seatNo]?.age || ""}
                    onChange={(event) => updatePassengerDetail(seatNo, { age: event.target.value })}
                    required
                  />
                  <select
                    className="input-core"
                    value={passengerDetails[seatNo]?.sex || "M"}
                    onChange={(event) => updatePassengerDetail(seatNo, { sex: event.target.value })}
                    required
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </form>

        <aside>
          <article className="card-core p-5">
            <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-100">Your Booking Status</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p className="font-semibold">Your Destination</p>
              <p>
                From:- <span className="font-semibold text-slate-800 dark:text-slate-100">{from}</span>
                <span className="mx-3 text-slate-400">··············</span>
                To:- <span className="font-semibold text-slate-800 dark:text-slate-100">{to}</span>
              </p>
              <p>
                Arrive at:- <span className="font-semibold text-slate-800 dark:text-slate-100">{selectedBus.arriveAt}</span>
                <span className="mx-3 text-slate-400">··············</span>
                Depart at:- <span className="font-semibold text-slate-800 dark:text-slate-100">{selectedBus.departAt}</span>
              </p>
              <p>
                Total No. of Seat <span className="float-right font-semibold text-slate-800 dark:text-slate-100">{selectedSeats.length}</span>
              </p>
              <p>
                Total Amount <span className="float-right text-xl font-bold text-violet-400">Rs. {totalPrice}</span>
              </p>
            </div>
          </article>

          <button
            onClick={handleSubmit}
            disabled={!user.user_id || loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-violet-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-violet-500"
          >
            {loading ? "Processing..." : "Proceed to Pay"}
            <FaArrowRight className="text-sm" />
          </button>
          {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
        </aside>
      </div>
    </section>
  );
};

export default Checkout;
