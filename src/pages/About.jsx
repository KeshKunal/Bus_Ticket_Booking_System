import React from "react";

const About = () => {
  return (
    <section className="section-wrap py-12">
      <article className="card-core p-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">About Us</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          This platform connects directly to the booking database to deliver live schedules, real-time seat
          availability, and instant e-ticket confirmations. It covers the complete journey: search, compare,
          select seats, checkout, pay, and review your travel history.
        </p>
      </article>
    </section>
  );
};

export default About;
