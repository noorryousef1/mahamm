import { Link } from "react-router-dom";
import "./BookCTA.css";

function BookCTA() {
  return (
    <section className="book-cta-section">
      <div className="book-cta">
        <div className="book-cta-text">
          <h2>احجز فعاليتك الآن</h2>
          <p>
            عرس، تخرج، ورشة أو مؤتمر؟ احكيلنا عن فكرتك والثيم اللي بتحبه،
            وفريقنا بيتواصل معك وبيرتّب كل التفاصيل.
          </p>
        </div>

        <Link to="/book" className="book-cta-btn">احجز هلّق</Link>
      </div>
    </section>
  );
}

export default BookCTA;
