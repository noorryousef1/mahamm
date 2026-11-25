import { useState, useEffect } from "react";
import SearchBox from "../SearchBox";
import { matches } from "../../utils/search";
import MemberForm from "./MemberForm";
import { getMembers } from "../../api";

function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    getMembers().then((data) => setMembers(data));
  }, []);

  const handleSave = (saved) => {
    const exists = members.some((m) => m.id === saved.id);
    setMembers(exists ? members.map((m) => (m.id === saved.id ? saved : m)) : [...members, saved]);
    setEditingId(null);
  };

  const filtered = members.filter((item) => matches(query, item.name, item.role));

  return (
    <section>
      <div className="admin-section-top">
        <p className="dashboard-subtitle">{members.length} أعضاء</p>
        <SearchBox value={query} onChange={setQuery} placeholder="ابحث عن عضو بالاسم أو الدور" />
        <button className="btn-add" onClick={() => setEditingId("new")}>+ إضافة عضو</button>
      </div>

      {editingId === "new" && (
        <MemberForm onSave={handleSave} onCancel={() => setEditingId(null)} />
      )}

      {query && filtered.length === 0 && (
        <p className="search-empty">ما في نتائج لـ "{query}"</p>
      )}

      <div className="admin-list">
        {filtered.map((member) =>
          editingId === member.id ? (
            <MemberForm
              key={member.id}
              member={member}
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div key={member.id} className="admin-row">
              {member.image ? (
                <img className="admin-avatar" src={member.image} alt="" />
              ) : (
                <div className="admin-avatar" style={{ background: member.color }}>
                  {member.name[0]}
                </div>
              )}
              <div className="admin-row-info">
                <h3>{member.name}</h3>
                <p style={{ color: member.color }}>{member.role}</p>
              </div>
              <button className="btn-edit" onClick={() => setEditingId(member.id)}>تعديل</button>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default AdminMembers;
