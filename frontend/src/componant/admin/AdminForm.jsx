import { useState } from "react";
import { createAdmin, updateAdmin, changeMyPassword } from "../../api";

const errorMessages = {
  "auth/email-already-in-use": "هاد الإيميل إله حساب من قبل",
  "auth/invalid-email": "الإيميل مش صحيح",
  "auth/weak-password": "كلمة السر ضعيفة، لازم تكون 6 حروف أو أكتر",
  "auth/requires-recent-login": "لتغيير كلمة السر، اطلع وادخل من جديد وبعدين جرّب",
};

function AdminForm({ admin, isMe, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: admin ? admin.name : "",
    email: admin ? admin.email : "",
    password: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password && form.password.length < 6) {
      setError("كلمة السر لازم تكون 6 حروف أو أكتر");
      return;
    }

    setSaving(true);
    try {
      let saved;
      if (admin) {
        saved = await updateAdmin(admin.id, { name: form.name.trim() });
        if (isMe && form.password) await changeMyPassword(form.password);
      } else {
        saved = await createAdmin({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });
      }
      onSave(saved);
    } catch (err) {
      setError(errorMessages[err.code] || "صار خطأ بالحفظ، جرّب كمان مرة");
    } finally {
      setSaving(false);
    }
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
          الإيميل
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            dir="ltr"
            autoComplete="off"
            disabled={Boolean(admin)}
            required
          />
        </label>
        {(!admin || isMe) && (
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
        )}
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
