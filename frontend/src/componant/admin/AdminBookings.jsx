import { useState, useEffect } from "react";
import SearchBox from "../SearchBox";
import { matches } from "../../utils/search";
import BookingCard from "../BookingCard";

function BookingActions({ booking, onUpdate }) {
  const [meeting, setMeeting] = useState({ date: "", time: "", place: "", link: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setMeeting({ ...meeting, [e.target.name]: e.target.value });
  };

  const updateBooking = (changes) => {
    fetch(`/api/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    })
      .then((res) => res.json())
      .then((updated) => onUpdate(updated));
  };

  const approve = (e) => {
    e.preventDefault();
    if (!meeting.place.trim() && !meeting.link.trim()) {
      setError("حط مكان الاجتماع أو رابط الاجتماع");
      return;
    }
    updateBooking({ status: "approved", meeting, adminMessage: message.trim() });
  };

  const reject = () => {
    updateBooking({ status: "rejected", adminMessage: message.trim() });
  };

  return (
    <form className="admin-actions" onSubmit={approve}>
      <p>حدّد موعد الاجتماع مع المنظمين:</p>
      <div className="admin-fields">
        <input type="date" name="date" value={meeting.date} onChange={handleChange} required />
        <input type="time" name="time" value={meeting.time} onChange={handleChange} required />
        <input name="place" placeholder="مكان الاجتماع (إذا وجهاً لوجه)" value={meeting.place} onChange={handleChange} />
        <input
          type="url"
          name="link"
          placeholder="رابط الاجتماع (Zoom / Meet)"
          value={meeting.link}
          onChange={handleChange}
          dir="ltr"
        />
      </div>

      <textarea
        className="admin-message"
        rows="3"
        placeholder="رسالة للمنظمين: بيانات إضافية، شو يجهّزوا للاجتماع، أو سبب الرفض..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-buttons">
        <button type="submit" className="btn-approve">موافقة</button>
        <button type="button" className="btn-reject" onClick={reject}>رفض</button>
      </div>
    </form>
  );
}

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings?_sort=createdAt&_order=desc")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = (updated) => {
    setBookings(bookings.map((b) => (b.id === updated.id ? updated : b)));
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  if (loading) return <p className="dashboard-status">جاري التحميل...</p>;

  const filtered = bookings.filter((item) => matches(query, item.code, item.organizer, item.occasion, item.phone, item.location, item.theme, item.date));

  return (
    <section>
      <div className="admin-section-top">
        <p className="dashboard-subtitle">
          {pendingCount} بانتظار المراجعة من أصل {bookings.length}
        </p>
        <SearchBox value={query} onChange={setQuery} placeholder="ابحث بالرمز، الاسم، المناسبة، الرقم أو المكان" />
      </div>

      {bookings.length === 0 && <p className="dashboard-status">لسا ما في طلبات حجز.</p>}

      {query && filtered.length === 0 && (
        <p className="search-empty">ما في نتائج لـ "{query}"</p>
      )}

      <div className="dashboard-list">
        {filtered.map((booking) => (
          <BookingCard key={booking.id} booking={booking}>
            {booking.status === "pending" && (
              <BookingActions booking={booking} onUpdate={handleUpdate} />
            )}
          </BookingCard>
        ))}
      </div>
    </section>
  );
}

export default AdminBookings;
