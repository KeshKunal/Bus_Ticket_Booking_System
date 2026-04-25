import React from "react";
import { FaBars, FaPhone, FaXmark } from "react-icons/fa6";
import { Link, NavLink } from "react-router-dom";

import Logo from "../../assets/logo.png";
import Theme from "../theme/Theme";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/bus", label: "Bus" },
    { href: "/services", label: "Services" },
];

const Navbar = () => {
    const [open, setOpen] = React.useState(false);

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
                                                ? "text-violet-500"
                                                : "text-slate-600 hover:text-violet-500 dark:text-slate-300 dark:hover:text-violet-400"
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 flex items-center gap-4 lg:mt-0 lg:ml-8">
                        <div className="relative rounded-md bg-violet-600 py-2 pl-8 pr-5 text-white">
                            <span className="absolute -left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-violet-600 text-xs shadow-sm dark:border-slate-950">
                                <FaPhone />
                            </span>
                            <p className="text-[10px] uppercase tracking-wide text-violet-100">Contact Us</p>
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