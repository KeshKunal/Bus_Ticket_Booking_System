import React from "react";

const services = [
  "Real-time bus listing and filtering",
  "Interactive seat selection with live availability",
  "Passenger detail capture per seat",
  "Secure payment flow with instant ticket",
  "Booking history and account access",
];

const Services = () => {
  return (
    <section className="section-wrap py-12">
      <article className="card-core p-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Services</h1>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-400">
          {services.map((service) => (
            <li key={service}>{service}</li>
          ))}
        </ul>
      </article>
    </section>
  );
};

export default Services;
