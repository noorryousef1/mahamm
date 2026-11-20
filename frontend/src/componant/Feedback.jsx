import "./Feedback.css";

function Feedback({ feedback }) {
  return (
    <section className="feedback">
      <h2>شو قالوا عنا</h2>
      <p className="feedback-subtitle">آراء المشاركين بفعالياتنا</p>

      {feedback.length === 0 && (
        <p className="feedback-empty">لسا ما في آراء، كون أول واحد بيشاركنا رأيه بآخر الصفحة </p>
      )}

      <div className="feedback-grid">
        {feedback.map((item) => (
          <article key={item.id} className="feedback-card">
            <span className="feedback-quote">”</span>
            <p className="feedback-text">{item.text}</p>
            <h3>{item.name}</h3>
            <span className="feedback-event">{item.eventName}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Feedback;
