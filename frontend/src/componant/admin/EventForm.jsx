import { useState } from "react";
import resizeImage, { imageErrorMessage } from "../../utils/resizeImage";

const emptyEvent = {
  name: "",
  description: "",
  date: "",
  location: "",
  color: "#0ea5e9",
  image: "",
  gallery: [],
  memberIds: [],
};

function EventForm({ event, members, onSave, onCancel }) {
  const [form, setForm] = useState(event ? { ...emptyEvent, ...event } : emptyEvent);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleMember = (id) => {
    const memberIds = form.memberIds.includes(id)
      ? form.memberIds.filter((m) => m !== id)
      : [...form.memberIds, id];
    setForm({ ...form, memberIds });
  };

  const handleMainImage = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    setProcessing((n) => n + 1);
    try {
      const image = await resizeImage(file, 1200);
      setForm((prev) => ({ ...prev, image }));
    } catch {
      setError(imageErrorMessage);
    } finally {
      setProcessing((n) => n - 1);
    }
  };

  const handleGallery = async (e) => {
    const files = [...e.target.files];
    e.target.value = "";
    if (files.length === 0) return;

    setError("");
    setProcessing((n) => n + 1);
    try {
      const resized = await Promise.all(files.map((f) => resizeImage(f, 1200)));
      setForm((prev) => ({ ...prev, gallery: [...prev.gallery, ...resized] }));
    } catch {
      setError(imageErrorMessage);
    } finally {
      setProcessing((n) => n - 1);
    }
  };

  const removeFromGallery = (index) => {
    setForm((prev) => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.image) {
      setError("لازم تحط صورة رئيسية للفعالية");
      return;
    }

    setSaving(true);
    const isNew = !event;

    fetch(isNew ? "/api/events" : `/api/events/${event.id}`, {
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
      <h3>{event ? `تعديل: ${event.name}` : "فعالية جديدة"}</h3>

      <div className="admin-form-grid">
        <label>
          اسم الفعالية
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          المكان
          <input name="location" value={form.location} onChange={handleChange} required />
        </label>
        <label>
          التاريخ
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
        </label>
        <label>
          لون الفعالية
          <input type="color" name="color" value={form.color} onChange={handleChange} />
        </label>
      </div>

      <label>
        الوصف
        <textarea name="description" rows="3" value={form.description} onChange={handleChange} required />
      </label>

      <label>
        {form.image ? "الصورة الرئيسية (اختار صورة جديدة لتبدّلها)" : "الصورة الرئيسية"}
        <input type="file" accept="image/*" onChange={handleMainImage} />
      </label>
      {form.image && <img className="admin-main-preview" src={form.image} alt="" />}

      <label>
        صور المعرض (اختياري)
        <input type="file" accept="image/*" multiple onChange={handleGallery} />
      </label>
      {form.gallery.length > 0 && (
        <div className="admin-thumbs">
          {form.gallery.map((src, index) => (
            <div key={index} className="admin-thumb">
              <img src={src} alt="" />
              <button type="button" onClick={() => removeFromGallery(index)}>×</button>
            </div>
          ))}
        </div>
      )}

      <fieldset className="admin-members-pick">
        <legend>الأعضاء المشاركين</legend>
        {members.map((member) => (
          <label key={member.id} className="admin-check">
            <input
              type="checkbox"
              checked={form.memberIds.includes(member.id)}
              onChange={() => toggleMember(member.id)}
            />
            {member.name}
          </label>
        ))}
      </fieldset>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-buttons">
        <button type="submit" className="btn-approve" disabled={saving || processing > 0}>
          {processing > 0 ? "جاري تجهيز الصور..." : saving ? "جاري الحفظ..." : "حفظ"}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>إلغاء</button>
      </div>
    </form>
  );
}

export default EventForm;
