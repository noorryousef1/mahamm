import { useState } from "react";
import BookingForm from "../componant/BookingForm";
import TrackBooking from "../componant/TrackBooking";
import "./Book.css";

// رموز الحجوزات اللي انعملت من هالجهاز، محفوظة بالمتصفح (localStorage)
function loadSavedCodes() {
  try {
    return JSON.parse(localStorage.getItem("myBookings")) || [];
  } catch {
    return [];
  }
}

function Book() {
  const [savedCodes, setSavedCodes] = useState(loadSavedCodes);

  // لما ينبعت حجز جديد: بنضيف رمزه للقائمة وبنحفظها
  const handleBooked = (code) => {
    const updated = [code, ...savedCodes];
    setSavedCodes(updated);
    try {
      localStorage.setItem("myBookings", JSON.stringify(updated));
    } catch {
      // إذا المتصفح مانع التخزين، الرمز بيضل ظاهر بالصفحة بس
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
