import { useState, useEffect } from "react";
import EventCard from "../componant/EventCard";
import Gallery from "../componant/Gallery";
import "./Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [galleryEvent, setGalleryEvent] = useState(null);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => setError("use (npm run server)."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="events-status">جاري التحميل...</p>;
  if (error) return <p className="events-status error">{error}</p>;

  return (
    <main className="events-page">
      <h1>الفعاليات</h1>
      <h4 className="events-subtitle">كل فعالياتنا ومهامها بمكان واحد</h4>

      <div className="events-grid">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onImageClick={() => setGalleryEvent(event)}
          />
        ))}
      </div>

      {galleryEvent && (
        <Gallery
          images={[galleryEvent.image, ...(galleryEvent.gallery || [])]}
          onClose={() => setGalleryEvent(null)}
        />
      )}
    </main>
  );
}

export default Events;
