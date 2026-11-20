import { useState } from "react";
import BookingForm from "../componant/BookingForm";
import TrackBooking from "../componant/TrackBooking";
import "./Book.css";

function loadSavedCodes() {
  try {
    return JSON.parse(localStorage.getItem("myBookings")) || [];
  } catch {
    return [];
  }
}

function Book() {
  const [savedCodes, setSavedCodes] = useState(loadSavedCodes);

  const handleBooked = (code) => {
    const updated = [code, ...savedCodes];
    setSavedCodes(updated);
    try {
      localStorage.setItem("myBookings", JSON.stringify(updated));
    } catch {
      return;
    }
  };

  return (
    <main className="book-page">
      <BookingForm onBooked={handleBooked} />
      <TrackBooking savedCodes={savedCodes} />
    </main>
  );
}

export default Book;
