import "./EventCard.css";

function EventCard({ event, onImageClick }) {
  const photosCount = 1 + (event.gallery ? event.gallery.length : 0);

  return (
    <article className="event-card">
      <button className="event-image" onClick={onImageClick}>
        <img src={event.image} alt={event.name} />
        <span className="photos-badge"> {photosCount} صور</span>
      </button>

      <div className="event-body">
        <h3 style={{ color: event.color }}>{event.name}</h3>
        <p className="event-desc">{event.description}</p>

        <div className="event-meta">
          <span> {event.date}</span>
          <span> {event.location}</span>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
