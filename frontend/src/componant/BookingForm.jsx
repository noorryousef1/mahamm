import { useState } from "react";
import "./BookingForm.css";

const emptyForm = {
  organizer: "",
  occasion: "",
  theme: "",
  location: "",
  date: "",
  time: "",
  guests: "",
  phone: "",
};

// بتصغّر الصورة قبل ما نبعتها، لحتى ما تكون ثقيلة على الباك
function resizeImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 800 / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// بيعمل رمز عشوائي للحجز، مثلاً: MH-7KQ2XP
// شلنا الحروف اللي بتتلخبط (O و 0، I و 1)
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "MH-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function BookingForm({ onBooked }) {
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [bookingCode, setBookingCode] = useState("");

  // دالة وحدة لكل الخانات: بتعرف الخانة من الـ name تبعها
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = async (e) => {
    const files = [...e.target.files].slice(0, 4 - images.length);
    const resized = await Promise.all(files.map(resizeImage));
    setImages([...images, ...resized]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setMessage("");
    setBookingCode("");

    const newBooking = {
      ...form,
      code: generateCode(),
      guests: Number(form.guests),
      images,
      status: "pending",
      meeting: null,
      createdAt: new Date().toISOString(),
    };

    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBooking),
    })
      .then((res) => res.json())
      .then((saved) => {
        setForm(emptyForm);
        setImages([]);
        setBookingCode(saved.code);
        onBooked(saved.code);
      })
      .catch(() => setMessage("صار خطأ، جرّب كمان مرة."))
      .finally(() => setSending(false));
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2>احجز فعاليتك</h2>
      <p className="booking-hint">عبّي التفاصيل، وفريقنا بيراجع الطلب وبيحددلك موعد اجتماع.</p>

      <div className="booking-grid">
        <label>
          اسم المنظمين
          <input name="organizer" value={form.organizer} onChange={handleChange} required />
        </label>

        <label>
          المناسبة
          <input name="occasion" placeholder="عرس، تخرج، ورشة..." value={form.occasion} onChange={handleChange} required />
        </label>

        <label>
          الثيم
          <input name="theme" placeholder="مثلاً: أزرق وأبيض، بسيط" value={form.theme} onChange={handleChange} required />
        </label>

        <label>
          المكان
          <input name="location" value={form.location} onChange={handleChange} required />
        </label>

        <label>
          التاريخ
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
        </label>

        <label>
          الساعة
          <input type="time" name="time" value={form.time} onChange={handleChange} required />
        </label>

        <label>
          عدد الأشخاص
          <input type="number" name="guests" min="1" value={form.guests} onChange={handleChange} required />
        </label>

        <label>
          رقم التواصل
          <input type="tel" name="phone" placeholder="059xxxxxxx" value={form.phone} onChange={handleChange} required />
        </label>
      </div>

      <label className="booking-upload">
        صور مشابهة للثيم (اختياري، لحد 4 صور)
        <input type="file" accept="image/*" multiple onChange={handleImages} disabled={images.length >= 4} />
      </label>

      {images.length > 0 && (
        <div className="booking-previews">
          {images.map((src, index) => (
            <div key={index} className="booking-preview">
              <img src={src} alt="" />
              <button type="button" onClick={() => removeImage(index)}>✕</button>
            </div>
          ))}
        </div>
      )}

      <button type="submit" className="booking-submit" disabled={sending}>
        {sending ? "جاري الإرسال..." : "أرسل الطلب"}
      </button>

      {message && <p className="booking-message">{message}</p>}

      {bookingCode && (
        <div className="booking-code-box">
          <p>وصل طلبك ✅ هاد رمز حجزك، احفظه لتتابع حالة الطلب:</p>
          <p className="booking-code-note">
            ⚠️ اكتبه أو صوّره. حفظناه كمان على هالجهاز، بس إذا فتحت من جهاز ثاني رح تحتاجه.
          </p>
          <strong className="booking-code">{bookingCode}</strong>
          <button type="button" onClick={() => navigator.clipboard.writeText(bookingCode)}>
            نسخ الرمز
          </button>
        </div>
      )}
    </form>
  );
}

export default BookingForm;
