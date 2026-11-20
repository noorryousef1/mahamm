import { useState } from "react";
import BookingCard from "./BookingCard";

function TrackBooking({ savedCodes }) {
  const [code, setCode] = useState("");
  const [bookings, setBookings] = useState(null);

  const searchByCode = (value) => {
    // بنشيل الفراغات وبنكبّر الحروف، لحتى "mh-7kq2xp" تشتغل كمان
    const cleanCode = value.trim().toUpperCase();

    // json-server بيفلتر لحاله: /bookings?code=MH-7KQ2XP
    fetch(`/api/bookings?code=${encodeURIComponent(cleanCode)}`)
      .then((res) => res.json())
      .then((data) => setBookings(data));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchByCode(code);
  };

  // لما يكبس على رمز محفوظ: بنحطه بالخانة وبنبحث فوراً
  const pickSaved = (saved) => {
    setCode(saved);
    searchByCode(saved);
  };

  return (
    <section className="track-booking">
      <h2>تابع حجزك</h2>
      <p className="track-hint">
        اكتب رمز الحجز اللي طلعلك بعد ما بعتّ الطلب. بيبلش بـ <b dir="ltr">MH-</b> وبعده 6 حروف وأرقام.
      </p>

      {savedCodes.length > 0 && (
        <div className="saved-codes">
          <span>حجوزاتك على هالجهاز:</span>
          {savedCodes.map((saved) => (
            <button key={saved} type="button" onClick={() => pickSaved(saved)} dir="ltr">
              {saved}
            </button>
          ))}
        </div>
      )}

      <form className="track-form" onSubmit={handleSearch}>
        <input
          placeholder="رمز الحجز، مثلاً MH-7KQ2XP"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit">بحث</button>
      </form>

      {bookings && bookings.length === 0 && (
        <p className="track-empty">ما لقينا حجز بهالرمز، تأكد منه وجرّب كمان مرة.</p>
      )}

      {bookings && bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </section>
  );
}

export default TrackBooking;
