import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import { BookingProvider } from "./context/BookingContext";
import About from "./pages/About";
import Bus from "./pages/Bus";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import SeatSelection from "./pages/SeatSelection";
import Services from "./pages/Services";
import Ticket from "./pages/Ticket";

const NotFoundPage = () => (
  <section className="section-wrap py-16">
    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Page Not Found</h1>
    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
      The page you are trying to access does not exist.
    </p>
  </section>
);

function App() {
  return (
    <Router>
      <BookingProvider>
        <div className="min-h-screen bg-slate-100 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200">
          <Navbar />
          <main className="pt-[76px]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bus" element={<Bus />} />
              <Route path="/bus/:busId" element={<SeatSelection />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/ticket" element={<Ticket />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BookingProvider>
    </Router>
  );
}

export default App;
