import React from "react";
import { useNavigate } from "react-router-dom";

import { useBooking } from "../context/BookingContext";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, user, loading, error } = useBooking();
  const [isSignup, setIsSignup] = React.useState(false);
  const [form, setForm] = React.useState({
    email: user.email || "",
    password: "",
    full_name: "",
    phone: "",
  });

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await loginUser(form);
      navigate("/bus");
    } catch (err) {
      // Error state is handled in context.
    }
  };

  return (
    <section className="section-wrap py-12">
      <article className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {isSignup ? "Create Account" : "Sign In"}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {isSignup
            ? "Create a new account to start booking bus tickets."
            : "Sign in to your account or create a new one."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
            <input
              type="email"
              className="input-core"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="e.g. john@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <input
              type="password"
              className="input-core"
              value={form.password}
              onChange={handleChange("password")}
              placeholder="Enter a secure password"
              required
            />
          </div>

          {isSignup && (
            <>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  className="input-core"
                  value={form.full_name}
                  onChange={handleChange("full_name")}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Phone</label>
                <input
                  type="tel"
                  className="input-core"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  placeholder="e.g. +91 12345 67890"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
          >
            {loading ? "Processing..." : isSignup ? "Create Account" : "Sign In"}
          </button>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm text-teal-600 hover:text-teal-500"
            >
              {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </article>
    </section>
  );
};

export default Login;
