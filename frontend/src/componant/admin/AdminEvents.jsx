import { useState, useEffect } from "react";
import SearchBox from "../SearchBox";
import { matches } from "../../utils/search";
import EventForm from "./EventForm";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/events").then((res) => res.json()),
      fetch("/api/members").then((res) => res.json()),
    ]).then(([eventsData, membersData]) => {
      setEvents(eventsData);
      setMembers(membersData);
    });
  }, []);

  const handleSave = (saved) => {
    const exists = events.some((e) => e.id === saved.id);
    setEvents(exists ? events.map((e) => (e.id === saved.id ? saved : e)) : [...events, saved]);
    setEditingId(null);
  };

  const filtered = events.filter((item) => matches(query, item.name, item.location, item.description, item.date));

  return (
    <section>
      <div className="admin-section-top">
        <p className="dashboard-subtitle">{events.length} فعاليات</p>
        <SearchBox value={query} onChange={setQuery} placeholder="ابحث عن فعالية بالاسم أو المكان" />
        <button className="btn-add" onClick={() => setEditingId("new")}>+ إضافة فعالية</button>
      </div>

      {editingId === "new" && (
        <EventForm members={members} onSave={handleSave} onCancel={() => setEditingId(null)} />
      )}

      {query && filtered.length === 0 && (
        <p className="search-empty">ما في نتائج لـ "{query}"</p>
      )}

      <div className="admin-list">
        {filtered.map((event) =>
          editingId === event.id ? (
            <EventForm
              key={event.id}
              event={event}
              members={members}
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div key={event.id} className="admin-row">
              <img src={event.image} alt="" />
              <div className="admin-row-info">
                <h3 style={{ color: event.color }}>{event.name}</h3>
                <p>{event.date} · {event.location}</p>
              </div>
              <button className="btn-edit" onClick={() => setEditingId(event.id)}>تعديل</button>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default AdminEvents;
