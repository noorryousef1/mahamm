import { useState, useEffect } from "react";
import SearchBox from "../SearchBox";
import { matches } from "../../utils/search";
import AdminForm from "./AdminForm";

function AdminAdmins() {
  const [admins, setAdmins] = useState([]);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const me = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    fetch("/api/admins")
      .then((res) => res.json())
      .then((data) => setAdmins(data));
  }, []);

  const handleSave = (saved) => {
    const exists = admins.some((a) => a.id === saved.id);
    setAdmins(exists ? admins.map((a) => (a.id === saved.id ? saved : a)) : [...admins, saved]);
    setEditingId(null);

    if (saved.id === me.id) {
      localStorage.setItem("admin", JSON.stringify({ id: saved.id, name: saved.name }));
    }
  };

  const remove = (admin) => {
    if (!window.confirm(`متأكد بدك تحذف الأدمن "${admin.name}"؟ ما رح يقدر يدخل على Dashboard بعدها.`)) return;

    fetch(`/api/admins/${admin.id}`, { method: "DELETE" }).then(() => {
      setAdmins(admins.filter((a) => a.id !== admin.id));
    });
  };

  const myAccount = admins.find((a) => a.id === me.id);
  const isOwner = myAccount?.role === "owner";
  const canEdit = (admin) => isOwner || admin.id === me.id;
  const canDelete = (admin) => isOwner && admin.id !== me.id;

  const filtered = admins.filter((item) => matches(query, item.name, item.username));

  return (
    <section>
      <div className="admin-section-top">
        <p className="dashboard-subtitle">{admins.length} أدمن بيقدروا يدخلوا على Dashboard</p>
        <SearchBox value={query} onChange={setQuery} placeholder="ابحث عن أدمن" />
        {isOwner && (
          <button className="btn-add" onClick={() => setEditingId("new")}>+ إضافة أدمن</button>
        )}
      </div>

      {myAccount && !isOwner && (
        <p className="admin-note">
          بس المالك بيقدر يضيف أدمن جداد أو يعدّل على حساباتهم. إنت بتقدر تعدّل حسابك إنت بس.
        </p>
      )}

      {isOwner && editingId === "new" && (
        <AdminForm admins={admins} onSave={handleSave} onCancel={() => setEditingId(null)} />
      )}

      {query && filtered.length === 0 && (
        <p className="search-empty">ما في نتائج لـ "{query}"</p>
      )}

      <div className="admin-list">
        {filtered.map((admin) =>
          editingId === admin.id && canEdit(admin) ? (
            <AdminForm
              key={admin.id}
              admin={admin}
              admins={admins}
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div key={admin.id} className="admin-row">
              <div className="admin-avatar" style={{ background: "#1e4a9e" }}>
                {admin.name[0]}
              </div>
              <div className="admin-row-info">
                <h3>
                  {admin.name}
                  {admin.role === "owner" && <span className="admin-owner"> (المالك)</span>}
                  {admin.id === me.id && <span className="admin-me"> (إنت)</span>}
                </h3>
                <p dir="ltr" className="admin-username">@{admin.username}</p>
              </div>
              {canEdit(admin) && (
                <button className="btn-edit" onClick={() => setEditingId(admin.id)}>تعديل</button>
              )}
              {canDelete(admin) && (
                <button className="btn-delete" onClick={() => remove(admin)}>حذف</button>
              )}
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default AdminAdmins;
