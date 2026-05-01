import React from "react";
import { useNavigate } from "react-router-dom";

import { useBooking } from "../context/BookingContext";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, user, loading, error } = useBooking();
  const [form, setForm] = React.useState({
    username: user.username || "",
    password: "",
  });

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await loginUser(form);
    navigate("/bus");
  };

  return (
    <section className="section-wrap py-12">
      <article className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sign In</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Keep it simple: create an account with a username and password.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Username</label>
            <input
              className="input-core"
              value={form.username}
              onChange={handleChange("username")}
              placeholder="e.g. travelqueen"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </form>
      </article>
    </section>
  );
};

export default Login;
