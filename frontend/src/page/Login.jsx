import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    login(email.trim(), password)
      .then(() => navigate("/dashboard"))
      .catch((err) => {
        if (err.message === "not-admin") {
          setError("هاد الحساب مش أدمن");
        } else if (err.code === "auth/network-request-failed") {
          setError("في مشكلة بالإنترنت، جرّب كمان مرة");
        } else {
          setError("الإيميل أو كلمة السر غلط");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <main className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <img src="/logo.png" alt="شعار مهام" className="login-logo" />
        <h1>تسجيل دخول الأدمن</h1>

        <label>
          الإيميل
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            dir="ltr"
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
