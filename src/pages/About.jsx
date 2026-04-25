import React from "react";

const About = () => {
  return (
    <section className="section-wrap py-12">
      <article className="card-core p-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">About Us</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          This DBMS project frontend demonstrates a complete online bus reservation journey: searching buses,
          selecting seats, filling passenger details, and confirming digital tickets. The backend APIs and database
          integration can be plugged in later without changing the user flow.
        </p>
      </article>
    </section>
  );
};

export default About;
