import React, { createContext, useContext, useMemo, useState } from "react";

import { buses } from "../data/buses";

const BookingContext = createContext(null);

const defaultTrip = {
  from: "",
  to: "",
  date: "",
  passengers: 1,
  busType: "Sleeper",
};

const defaultPassenger = {
  fullName: "",
  email: "",
  phone: "",
  altPhone: "",
};

export const BookingProvider = ({ children }) => {
  const [trip, setTrip] = useState(defaultTrip);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passenger, setPassenger] = useState(defaultPassenger);

  const selectedBus = useMemo(
    () => buses.find((bus) => bus.id === selectedBusId) ?? null,
    [selectedBusId],
  );

  const updateTrip = (patch) => {
    setTrip((prev) => ({ ...prev, ...patch }));
  };

  const chooseBus = (busId) => {
    setSelectedBusId(busId);
    setSelectedSeats([]);
  };

  const toggleSeat = (seatNo) => {
    if (!selectedBus || selectedBus.bookedSeats.includes(seatNo)) {
      return;
    }

    setSelectedSeats((prev) => {
      if (prev.includes(seatNo)) {
        return prev.filter((seat) => seat !== seatNo);
      }

      const maxSeats = Number(trip.passengers) || 1;
      if (prev.length >= maxSeats) {
        return prev;
      }

      return [...prev, seatNo].sort((a, b) => a - b);
    });
  };

  const updatePassenger = (patch) => {
    setPassenger((prev) => ({ ...prev, ...patch }));
  };

  const clearBooking = () => {
    setTrip(defaultTrip);
    setSelectedBusId(null);
    setSelectedSeats([]);
    setPassenger(defaultPassenger);
  };

  const totalPrice = selectedBus ? selectedSeats.length * selectedBus.price : 0;

  const value = {
    buses,
    trip,
    selectedBus,
    selectedSeats,
    passenger,
    totalPrice,
    updateTrip,
    chooseBus,
    toggleSeat,
    updatePassenger,
    clearBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBooking must be used inside BookingProvider");
  }

  return context;
};
