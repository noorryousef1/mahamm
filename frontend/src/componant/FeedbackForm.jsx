import { useState } from "react";
import { sendFeedback } from "../api";
import "./FeedbackForm.css";

function FeedbackForm() {
  const [name, setName] = useState("");
  const [eventName, setEventName] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setMessage("");

    sendFeedback({ name: name.trim(), eventName: eventName.trim(), text: text.trim() })
      .then(() => {
        setName("");
        setEventName("");
        setText("");
        setMessage("شكراً! وصل رأيك، ورح ينعرض بعد ما نراجعه.");
      })
      .catch(() => setMessage("صار خطأ، جرّب كمان مرة."))
      .finally(() => setSending(false));
  };

  return (
    <section className="feedback-form-section">
      <form className="feedback-form" onSubmit={handleSubmit}>
        <h3>شاركنا رأيك</h3>

        <div className="form-row">
          <input
            type="text"
            placeholder="اسمك"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="اسم الفعالية"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>

        <textarea
          placeholder="اكتب رأيك بالفعالية..."
          rows="4"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <button type="submit" disabled={sending}>
          {sending ? "جاري الإرسال..." : "إرسال"}
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </section>
  );
}

export default FeedbackForm;
