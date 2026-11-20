import { useState } from "react";
import resizeImage, { imageErrorMessage } from "../../utils/resizeImage";

const emptyMember = { name: "", role: "", color: "#6366f1", image: "" };

function MemberForm({ member, onSave, onCancel }) {
  const [form, setForm] = useState(member ? { ...emptyMember, ...member } : emptyMember);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    setProcessing(true);
    try {
      const image = await resizeImage(file, 400);
      setForm((prev) => ({ ...prev, image }));
    } catch {
      setError(imageErrorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    const isNew = !member;

    fetch(isNew ? "/api/members" : `/api/members/${member.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isNew ? { ...form, id: String(Date.now()) } : form),
    })
      .then((res) => res.json())
      .then((saved) => onSave(saved))
      .catch(() => setError("صار خطأ بالحفظ، جرّب كمان مرة"))
      .finally(() => setSaving(false));
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>{member ? `تعديل: ${member.name}` : "عضو جديد"}</h3>

      <div className="admin-form-grid">
        <label>
          الاسم
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          الدور
          <input name="role" placeholder="مثلاً: مصممة" value={form.role} onChange={handleChange} required />
        </label>
        <label>
          اللون
          <input type="color" name="color" value={form.color} onChange={handleChange} />
        </label>
        <label>
          الصورة (اختياري)
          <input type="file" accept="image/*" onChange={handleImage} />
        </label>
      </div>

      {form.image && (
        <div className="admin-avatar-preview">
          <img src={form.image} alt="" />
          <button type="button" onClick={() => setForm({ ...form, image: "" })}>شيل الصورة</button>
        </div>
      )}

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-buttons">
        <button type="submit" className="btn-approve" disabled={saving || processing}>
          {processing ? "جاري تجهيز الصورة..." : saving ? "جاري الحفظ..." : "حفظ"}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>إلغاء</button>
      </div>
    </form>
  );
}

export default MemberForm;
