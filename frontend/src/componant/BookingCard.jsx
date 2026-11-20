import "./BookingCard.css";

const statusLabels = {
  pending: "قيد المراجعة",
  approved: "تمت الموافقة",
  rejected: "مرفوض",
};

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
          <span>التاريخ: {booking.meeting.date}</span>
          <span>الساعة: {booking.meeting.time}</span>
          {booking.meeting.place && <span>المكان: {booking.meeting.place}</span>}
          {booking.meeting.link && (
            <a href={booking.meeting.link} target="_blank" rel="noopener noreferrer">
              رابط الاجتماع
            </a>
          )}
        </div>
      )}

      {booking.adminMessage && (
        <div className={`booking-admin-message ${booking.status}`}>
          <b>رسالة من فريق مهام:</b>
          <p>{booking.adminMessage}</p>
        </div>
      )}

      {children}
    </article>
  );
}

export default BookingCard;
