import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";

const getInitialTheme = () => {
    const stored = localStorage.getItem("theme");
    if (stored) {
        return stored;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const Theme = () => {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <button
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition hover:bg-teal-500 hover:text-white dark:bg-slate-800 dark:text-slate-100"
            aria-label="Switch theme"
            title="Switch theme"
        >
            {theme === "dark" ? <FaMoon className="text-sm" /> : <FaSun className="text-sm" />}
        </button>
    );
};

export default Theme;