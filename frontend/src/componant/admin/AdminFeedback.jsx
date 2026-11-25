import { useState, useEffect } from "react";
import SearchBox from "../SearchBox";
import { matches } from "../../utils/search";
import { getAllFeedback, setFeedbackStatus, deleteFeedback } from "../../api";

const statusLabels = {
  pending: "بانتظار المراجعة",
  approved: "منشور",
  rejected: "مخفي",
};

function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getAllFeedback().then((data) => setFeedback(data));
  }, []);

  const setStatus = (item, status) => {
    setFeedbackStatus(item.id, status).then(() => {
      setFeedback(feedback.map((f) => (f.id === item.id ? { ...f, status } : f)));
    });
  };

  const remove = (item) => {
    if (!window.confirm(`متأكد بدك تحذف رأي "${item.name}" نهائياً؟`)) return;

    deleteFeedback(item.id).then(() => {
      setFeedback(feedback.filter((f) => f.id !== item.id));
    });
  };

  const pendingCount = feedback.filter((f) => f.status === "pending").length;

  const filtered = feedback.filter((item) => matches(query, item.name, item.eventName, item.text));

  return (
    <section>
      <div className="admin-section-top">
        <p className="dashboard-subtitle">
          {pendingCount} بانتظار المراجعة من أصل {feedback.length}. الرأي ما بيطلع بالصفحة الرئيسية إلا بعد النشر.
        </p>
        <SearchBox value={query} onChange={setQuery} placeholder="ابحث بالاسم أو الفعالية أو نص الرأي" />
      </div>

      {feedback.length === 0 && <p className="dashboard-status">لسا ما في آراء.</p>}

      {query && filtered.length === 0 && (
        <p className="search-empty">ما في نتائج لـ "{query}"</p>
      )}

      <div className="admin-list">
        {filtered.map((item) => (
          <div key={item.id} className="admin-feedback">
            <div className="admin-feedback-top">
              <h3>{item.name} · <span>{item.eventName}</span></h3>
              <span className={`status status-${item.status}`}>{statusLabels[item.status]}</span>
            </div>

            <p>{item.text}</p>

            <div className="admin-buttons">
              {item.status !== "approved" && (
                <button className="btn-approve" onClick={() => setStatus(item, "approved")}>نشر</button>
              )}
              {item.status === "approved" && (
                <button className="btn-cancel" onClick={() => setStatus(item, "rejected")}>إخفاء</button>
              )}
              {item.status === "pending" && (
                <button className="btn-cancel" onClick={() => setStatus(item, "rejected")}>رفض</button>
              )}
              <button className="btn-reject" onClick={() => remove(item)}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminFeedback;
