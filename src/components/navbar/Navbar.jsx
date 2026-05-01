import React from "react";
import { FaBars, FaPhone, FaXmark } from "react-icons/fa6";
import { Link, NavLink } from "react-router-dom";

import Logo from "../../assets/Logo_Beach.svg";
import Theme from "../theme/Theme";
import { useBooking } from "../../context/BookingContext";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/bus", label: "Bus" },
    { href: "/services", label: "Services" },
    { href: "/history", label: "History" },
];

const Navbar = () => {
    const [open, setOpen] = React.useState(false);
    const { user, logoutUser } = useBooking();
    const displayName = user?.username || user?.full_name || "";

    const closeMenu = () => setOpen(false);

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/50 bg-white/90 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-950/90">
            <nav className="section-wrap flex h-[76px] items-center justify-between">
                <Link to="/" className="shrink-0">
                    <img src={Logo} alt="GBUS" className="h-auto w-28 object-contain" />
                </Link>

                <button
                    onClick={() => setOpen((prev) => !prev)}
                    className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 lg:hidden"
                    aria-label="Toggle menu"
                >
                    {open ? <FaXmark className="text-lg" /> : <FaBars className="text-lg" />}
                </button>

                <div
                    className={`absolute left-0 right-0 top-[76px] border-b border-slate-200 bg-white px-4 py-4 shadow-lg dark:border-slate-800 dark:bg-slate-950 lg:static lg:flex lg:items-center lg:gap-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none ${
                        open ? "block" : "hidden lg:flex"
                    }`}
                >
                    <ul className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-5">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <NavLink
                                    to={link.href}
                                    onClick={closeMenu}
                                    className={({ isActive }) =>
                                        `text-sm font-semibold transition ${
                                            isActive
                                                ? "text-teal-600"
                                                : "text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-300"
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 flex items-center gap-4 lg:mt-0 lg:ml-8">
                        {user?.user_id ? (
                            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                {displayName || "Signed in"}
                                <button
                                    onClick={() => {
                                        logoutUser();
                                        closeMenu();
                                    }}
                                    className="ml-2 rounded-full border border-teal-500/40 px-2 py-0.5 text-[10px] font-semibold text-teal-600"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                onClick={closeMenu}
                                className="rounded-md border border-teal-500/40 px-3 py-2 text-xs font-semibold text-teal-600"
                            >
                                Login
                            </Link>
                        )}
                        <div className="relative rounded-md bg-teal-600 py-2 pl-8 pr-5 text-white">
                            <span className="absolute -left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-teal-600 text-xs shadow-sm dark:border-slate-950">
                                <FaPhone />
                            </span>
                            <p className="text-[10px] uppercase tracking-wide text-teal-100">Contact Us</p>
                            <p className="text-xs font-semibold">+91 1234567890</p>
                        </div>
                        <Theme />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;