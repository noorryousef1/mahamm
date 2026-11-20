import { useState } from "react";

function AdminForm({ admin, admins, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: admin ? admin.name : "",
    username: admin ? admin.username : "",
    password: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const username = form.username.trim().toLowerCase();

    const taken = admins.some((a) => a.username === username && (!admin || a.id !== admin.id));
    if (taken) {
      setError("اسم المستخدم هاد مستعمل، اختار اسم ثاني");
      return;
    }

    if (form.password && form.password.length < 6) {
      setError("كلمة السر لازم تكون 6 حروف أو أكتر");
      return;
    }

    const isNew = !admin;
    const data = { name: form.name.trim(), username };
    if (form.password) data.password = form.password;
    if (isNew) {
      data.id = String(Date.now());
      data.role = "admin";
    }

    setSaving(true);
    fetch(isNew ? "/api/admins" : `/api/admins/${admin.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((saved) => onSave(saved))
      .catch(() => setError("صار خطأ بالحفظ، جرّب كمان مرة"))
      .finally(() => setSaving(false));
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>{admin ? `تعديل: ${admin.name}` : "أدمن جديد"}</h3>

      <div className="admin-form-grid">
        <label>
          الاسم
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          اسم المستخدم
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            dir="ltr"
            autoComplete="off"
            required
          />
        </label>
        <label>
          {admin ? "كلمة سر جديدة (اتركها فاضية إذا ما بدك تغيّرها)" : "كلمة السر"}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            required={!admin}
          />
        </label>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-buttons">
        <button type="submit" className="btn-approve" disabled={saving}>
          {saving ? "جاري الحفظ..." : "حفظ"}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>إلغاء</button>
      </div>
    </form>
  );
}

export default AdminForm;
