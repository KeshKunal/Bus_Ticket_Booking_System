import React from "react";
import { FaLock } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import { useBooking } from "../context/BookingContext";

const Payment = () => {
  const navigate = useNavigate();
  const {
    selectedBus,
    selectedSeats,
    totalPrice,
    trip,
    user,
    loading,
    error,
    bookSeats,
  } = useBooking();
  const [method, setMethod] = React.useState("upi");

  if (!selectedBus || selectedSeats.length === 0) {
    return (
      <section className="section-wrap py-16 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300">No active booking. Please select seats first.</p>
        <button
          className="mt-3 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white"
          onClick={() => navigate("/bus")}
        >
          Choose Bus
        </button>
      </section>
    );
  }

  if (!user.user_id) {
    return (
      <section className="section-wrap py-16 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300">Please login to complete payment.</p>
        <button
          className="mt-3 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </section>
    );
  }

  const handlePay = async (event) => {
    event.preventDefault();
    const result = await bookSeats();
    if (result) {
      navigate("/ticket");
    }
  };

  return (
    <section className="section-wrap py-10">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handlePay} className="card-core p-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Secure Payment</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Choose a payment method and confirm to receive your e-ticket instantly.
          </p>

          <div className="mt-6 space-y-3">
            <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment-method"
                  value="upi"
                  checked={method === "upi"}
                  onChange={() => setMethod("upi")}
                />
                UPI
              </span>
              <span className="text-xs text-slate-500">Instant</span>
            </label>
            <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment-method"
                  value="card"
                  checked={method === "card"}
                  onChange={() => setMethod("card")}
                />
                Card
              </span>
              <span className="text-xs text-slate-500">Visa / MasterCard</span>
            </label>
            <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment-method"
                  value="netbanking"
                  checked={method === "netbanking"}
                  onChange={() => setMethod("netbanking")}
                />
                Netbanking
              </span>
              <span className="text-xs text-slate-500">Trusted banks</span>
            </label>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>Selected seats</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedSeats.join(", ")}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>Route</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {trip.from || selectedBus.from} to {trip.to || selectedBus.to}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-slate-500">Total payable</span>
              <span className="text-2xl font-extrabold text-amber-600">Rs. {totalPrice}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-500"
          >
            <FaLock className="text-xs" />
            {loading ? "Processing Payment..." : "Pay & Confirm Ticket"}
          </button>
          {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
        </form>

        <aside className="space-y-4">
          <article className="card-core p-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Why this is secure</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>UPI and card transactions are tokenized.</li>
              <li>Your passenger details never leave our encrypted database.</li>
              <li>Instant confirmation after successful payment.</li>
            </ul>
          </article>

          <article className="card-core p-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Need help?</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Reach our support team 24/7 for payment issues, refunds, or booking changes.
            </p>
            <p className="mt-3 text-sm font-semibold text-teal-600">support@gbus.in</p>
          </article>
        </aside>
      </div>
    </section>
  );
};

export default Payment;
