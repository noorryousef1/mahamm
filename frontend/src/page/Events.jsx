import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import EventCard from "../componant/EventCard";
import Gallery from "../componant/Gallery";
import { matches } from "../utils/search";
import { getEvents } from "../api";
import "./Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [galleryEvent, setGalleryEvent] = useState(null);

  useEffect(() => {
    getEvents()
      .then((data) => setEvents(data))
      .catch(() => setError("ما قدرنا نجيب الفعاليات، جرّب تحدّث الصفحة."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="events-status">جاري التحميل...</p>;
  if (error) return <p className="events-status error">{error}</p>;

  const filtered = events.filter((event) =>
    matches(query, event.name, event.location, event.description, event.date)
  );

  return (
    <main className="events-page">
      <h1>الفعاليات</h1>
      <h4 className="events-subtitle">كل فعالياتنا ومهامها بمكان واحد</h4>

      {query && (
        <div className="page-search">
          <span className="search-count">
            نتائج البحث عن "{query}": {filtered.length}
          </span>
          <button className="search-clear" onClick={() => setSearchParams({})}>
            عرض كل الفعاليات
          </button>
        </div>
      )}

      {query && filtered.length === 0 && (
        <p className="search-empty">ما لقينا فعاليات بـ "{query}". جرّب كلمة ثانية.</p>
      )}

      <div className="events-grid">
        {filtered.map((event) => (
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
