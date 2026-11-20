import "./BookingCard.css";

const statusLabels = {
  pending: "قيد المراجعة",
  approved: "تمت الموافقة",
  rejected: "مرفوض",
};

// كارد بيعرض تفاصيل حجز وحالته
// children: أي إشي زيادة بدنا نحطه تحت (زي أزرار الأدمن بالداشبورد)
function BookingCard({ booking, children }) {
  return (
    <article className="booking-card">
      <div className="booking-card-top">
        <h3>{booking.occasion}</h3>
        <span className={`status status-${booking.status}`}>
          {statusLabels[booking.status]}
        </span>
      </div>

      <ul className="booking-details">
        <li><b>رمز الحجز:</b> <span dir="ltr">{booking.code}</span></li>
        <li><b>المنظمين:</b> {booking.organizer}</li>
        <li><b>الثيم:</b> {booking.theme}</li>
        <li><b>المكان:</b> {booking.location}</li>
        <li><b>التاريخ:</b> {booking.date}</li>
        <li><b>الساعة:</b> {booking.time}</li>
        <li><b>عدد الأشخاص:</b> {booking.guests}</li>
        <li><b>رقم التواصل:</b> {booking.phone}</li>
      </ul>

      {booking.images && booking.images.length > 0 && (
        <div className="booking-images">
          {booking.images.map((src, index) => (
            <img key={index} src={src} alt="" />
          ))}
        </div>
      )}

      {booking.status === "approved" && booking.meeting && (
        <div className="booking-meeting">
          <b>موعد الاجتماع معنا:</b>
          <span>📅 {booking.meeting.date}</span>
          <span>🕐 {booking.meeting.time}</span>
          <span>📍 {booking.meeting.place}</span>
        </div>
      )}

      {children}
    </article>
  );
}

export default BookingCard;
