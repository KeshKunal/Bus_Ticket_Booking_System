import React from "react";
import { FaMapPin } from "react-icons/fa6";
import { Link } from "react-router-dom";

import Logo from "../../assets/Logo_Beach.svg";

const links = {
  about: ["About Us", "Contact Us", "Privacy Policy", "Terms and Conditions"],
  services: ["Safety Guarantee", "FAQ & Support", "Luxury Buses", "Enough Facilities"],
};

const Footer = () => {
  return (
    <footer className="mt-10 border-t border-slate-200/60 bg-slate-100/70 py-8 dark:border-slate-800 dark:bg-slate-900/70">
      <div className="section-wrap grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link to="/">
            <img src={Logo} alt="GBUS" className="h-auto w-36 object-contain" />
          </Link>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Book intercity buses with transparent prices, secure digital tickets, and real-time seat
            selection.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">About Us</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            {links.about.map((item) => (
              <li key={item}>
                <Link to="/about" className="transition hover:text-teal-600">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Services</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            {links.services.map((item) => (
              <li key={item}>
                <Link to="/services" className="transition hover:text-teal-600">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Get In Touch</h3>
          <div className="mt-3 space-y-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                <FaMapPin className="mt-1 shrink-0 text-xs text-slate-500" />
                <p>
                  For Support & Reservations
                  <br />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">123, Main Street, Anytown, USA</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;