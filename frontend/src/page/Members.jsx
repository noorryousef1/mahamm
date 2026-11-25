import { useState, useEffect } from "react";
import MemberCard from "../componant/MemberCard";
import { getMembers, getEvents } from "../api";
import "./Members.css";

function Members() {
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getMembers(), getEvents()])
      .then(([membersData, eventsData]) => {
        setMembers(membersData);
        setEvents(eventsData);
      })
      .catch(() => setError("ما قدرنا نجيب الأعضاء، جرّب تحدّث الصفحة."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="members-status">جاري التحميل...</p>;
  if (error) return <p className="members-status error">{error}</p>;

  return (
    <main className="members-page">
      <h1>فريق العمل</h1>
      <h4 className="members-subtitle">الناس اللي بيخلّوا الفعاليات تصير</h4>

      <div className="members-grid">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            events={events.filter((event) => event.memberIds.includes(member.id))}
          />
        ))}
      </div>
    </main>
  );
}

export default Members;
