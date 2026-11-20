import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookingCard from "../componant/BookingCard";
import "./Dashboard.css";

// أزرار الأدمن تحت كل حجز لسا قيد المراجعة
function AdminActions({ booking, onUpdate }) {
  const [meeting, setMeeting] = useState({ date: "", time: "", place: "" });

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
    updateBooking({ status: "approved", meeting });
  };

  const reject = () => {
    updateBooking({ status: "rejected" });
  };

  return (
    <form className="admin-actions" onSubmit={approve}>
      <p>حدّد موعد الاجتماع مع المنظمين:</p>
      <div className="admin-fields">
        <input type="date" name="date" value={meeting.date} onChange={handleChange} required />
        <input type="time" name="time" value={meeting.time} onChange={handleChange} required />
        <input name="place" placeholder="مكان الاجتماع" value={meeting.place} onChange={handleChange} required />
      </div>
      <div className="admin-buttons">
        <button type="submit" className="btn-approve">موافقة</button>
        <button type="button" className="btn-reject" onClick={reject}>رفض</button>
      </div>
    </form>
  );
}

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin"));

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/login");
  };

  useEffect(() => {
    fetch("/api/bookings?_sort=createdAt&_order=desc")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .finally(() => setLoading(false));
  }, []);

  // بنبدّل الحجز القديم بالجديد اللي رجع من الباك
  const handleUpdate = (updated) => {
    setBookings(bookings.map((b) => (b.id === updated.id ? updated : b)));
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  if (loading) return <p className="dashboard-status">جاري التحميل...</p>;

  return (
    <main className="dashboard-page">
      <div className="dashboard-top">
        <h1>Dashboard</h1>
        <div className="dashboard-user">
          <span>أهلاً، {admin.name}</span>
          <button onClick={logout}>تسجيل خروج</button>
        </div>
      </div>
      <p className="dashboard-subtitle">
        طلبات الحجز · {pendingCount} بانتظار المراجعة من أصل {bookings.length}
      </p>

      {bookings.length === 0 && <p className="dashboard-status">لسا ما في طلبات حجز.</p>}

      <div className="dashboard-list">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking}>
            {booking.status === "pending" && (
              <AdminActions booking={booking} onUpdate={handleUpdate} />
            )}
          </BookingCard>
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
