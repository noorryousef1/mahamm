import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    fetch(`/api/admins?username=${encodeURIComponent(username.trim().toLowerCase())}`)
      .then((res) => res.json())
      .then((admins) => {
        const admin = admins[0];

        if (!admin || admin.password !== password) {
          setError("اسم المستخدم أو كلمة السر غلط");
          return;
        }

        localStorage.setItem("admin", JSON.stringify({ id: admin.id, name: admin.name }));
        navigate("/dashboard");
      })
      .catch(() => setError("ما قدرنا نوصل للسيرفر، تأكد إنه الباك شغّال"))
      .finally(() => setLoading(false));
  };

  return (
    <main className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <img src="/logo.png" alt="شعار مهام" className="login-logo" />
        <h1>تسجيل دخول الأدمن</h1>

        <label>
          اسم المستخدم
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label>
          كلمة السر
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="login-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
    </main>
  );
}

export default Login;
