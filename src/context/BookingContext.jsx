import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { buses as staticBuses } from "../data/buses";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

const defaultUser = {
  user_id: null,
  full_name: "",
  email: "",
  phone: "",
};

const formatTime = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const imageForType = (type) => {
  const sleeper = staticBuses.find((bus) => bus.type === "Sleeper");
  const seater = staticBuses.find((bus) => bus.type === "Seater");

  if (type === "Sleeper") {
    return sleeper?.image || staticBuses[0]?.image || "";
  }

  return seater?.image || staticBuses[0]?.image || "";
};

const loadStoredUser = () => {
  try {
    const raw = window.localStorage.getItem("btbs_user");
    if (!raw) {
      return defaultUser;
    }
    return { ...defaultUser, ...JSON.parse(raw) };
  } catch {
    return defaultUser;
  }
};

export const BookingProvider = ({ children }) => {
  const [trip, setTrip] = useState(defaultTrip);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passenger, setPassenger] = useState(defaultPassenger);
  const [user, setUser] = useState(loadStoredUser);
  const [locations, setLocations] = useState([]);
  const [buses, setBuses] = useState([]);
  const [seatMap, setSeatMap] = useState({});
  const [passengerDetails, setPassengerDetails] = useState({});
  const [bookingSummary, setBookingSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedBus = useMemo(
    () => buses.find((bus) => bus.id === selectedBusId) ?? null,
    [selectedBusId, buses],
  );

  const seatsForSelectedBus = useMemo(() => {
    if (!selectedBusId) {
      return {};
    }
    return seatMap[selectedBusId] || {};
  }, [seatMap, selectedBusId]);

  const updateTrip = (patch) => {
    setTrip((prev) => ({ ...prev, ...patch }));
  };

  const chooseBus = (busId) => {
    setSelectedBusId(busId);
    setSelectedSeats([]);
    setPassengerDetails({});
  };

  const toggleSeat = (seatNo) => {
    const seatData = seatsForSelectedBus[seatNo];
    if (!selectedBus || !seatData || !seatData.is_available) {
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

  const updatePassengerDetail = (seatNo, patch) => {
    setPassengerDetails((prev) => ({
      ...prev,
      [seatNo]: { ...prev[seatNo], ...patch },
    }));
  };

  const loginUser = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      setUser(data);
      window.localStorage.setItem("btbs_user", JSON.stringify(data));
      return data;
    } catch (err) {
      setError("Unable to login. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setUser(defaultUser);
    window.localStorage.removeItem("btbs_user");
  };

  const loadLocations = async () => {
    try {
      const response = await fetch(`${API_URL}/locations`);
      if (!response.ok) {
        throw new Error("Failed to load locations");
      }
      const data = await response.json();
      setLocations(data.map((loc) => loc.city_name));
    } catch (err) {
      setLocations([]);
    }
  };

  const searchBuses = async () => {
    if (!trip.from || !trip.to || !trip.date) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        origin: trip.from,
        destination: trip.to,
        date: trip.date,
      });
      const response = await fetch(`${API_URL}/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to search buses");
      }

      const data = await response.json();
      const mapped = data.map((row) => ({
        id: String(row.schedule_id),
        name: `Bus ${row.bus_number}`,
        type: row.bus_type || "Seater",
        image: imageForType(row.bus_type),
        totalSeats: row.capacity,
        rating: 4.4,
        from: row.origin_city,
        to: row.destination_city,
        departAt: formatTime(row.departure_time),
        arriveAt: formatTime(row.arrival_time),
      }));

      setBuses(mapped);
      return mapped;
    } catch (err) {
      setError("Unable to fetch buses. Try again.");
      setBuses([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const loadSeats = async (scheduleId) => {
    if (!scheduleId) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/seats/${scheduleId}`);
      if (!response.ok) {
        throw new Error("Failed to load seats");
      }
      const data = await response.json();
      const mapped = data.reduce((acc, seat) => {
        const seatNumber = Number(seat.seat_number) || seat.seat_number;
        acc[seatNumber] = {
          seat_id: seat.seat_id,
          seat_number: seatNumber,
          seat_type: seat.seat_type,
          fare: Number(seat.fare),
          is_available: Boolean(seat.is_available),
        };
        return acc;
      }, {});

      setSeatMap((prev) => ({ ...prev, [scheduleId]: mapped }));
    } catch (err) {
      setSeatMap((prev) => ({ ...prev, [scheduleId]: {} }));
    }
  };

  const bookSeats = async () => {
    if (!user.user_id || !selectedBusId || selectedSeats.length === 0) {
      return null;
    }

    const seatPayload = selectedSeats.map((seatNo) => {
      const seatData = seatsForSelectedBus[seatNo];
      return {
        seat_id: seatData?.seat_id,
        passenger: passengerDetails[seatNo],
      };
    });

    const missingPassenger = seatPayload.some(
      (seat) => !seat.seat_id || !seat.passenger?.name || !seat.passenger?.age || !seat.passenger?.sex,
    );

    if (missingPassenger) {
      setError("Please fill passenger details for every selected seat.");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          schedule_id: Number(selectedBusId),
          seats: seatPayload,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Booking failed");
      }

      const data = await response.json();
      setBookingSummary({
        ...data,
        trip,
        selectedBus,
        selectedSeats,
      });
      await loadSeats(selectedBusId);
      return data;
    } catch (err) {
      setError(err.message || "Unable to complete booking.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearBooking = () => {
    setTrip(defaultTrip);
    setSelectedBusId(null);
    setSelectedSeats([]);
    setPassenger(defaultPassenger);
    setPassengerDetails({});
    setBookingSummary(null);
  };

  const totalPrice = selectedSeats.reduce((sum, seatNo) => {
    const seatData = seatsForSelectedBus[seatNo];
    return sum + (seatData?.fare || 0);
  }, 0);

  useEffect(() => {
    loadLocations();
  }, []);

  const value = {
    buses,
    trip,
    selectedBus,
    selectedSeats,
    passenger,
    totalPrice,
    user,
    locations,
    bookingSummary,
    loading,
    error,
    passengerDetails,
    seatsForSelectedBus,
    updateTrip,
    chooseBus,
    toggleSeat,
    updatePassenger,
    updatePassengerDetail,
    loginUser,
    logoutUser,
    searchBuses,
    loadSeats,
    bookSeats,
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
