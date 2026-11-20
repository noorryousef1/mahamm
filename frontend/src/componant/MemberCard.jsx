import "./MemberCard.css";

function MemberCard({ member, events }) {
  return (
    <article className="member-card">
      {member.image ? (
        <img className="member-avatar" src={member.image} alt={member.name} />
      ) : (
        <div className="member-avatar" style={{ background: member.color }}>
          {member.name[0]}
        </div>
      )}

      <h3>{member.name}</h3>
      <p className="member-role" style={{ color: member.color }}>{member.role}</p>

      <div className="member-events">
        {events.map((event) => (
          <span key={event.id} className="member-event">{event.name}</span>
        ))}
      </div>
    </article>
  );
}

export default MemberCard;
