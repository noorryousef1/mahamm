import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <Link to="/" className="brand">
        <img src="/logo.png" alt="شعار مهام" className="brand-img" />
        <span className="brand-name">مهام</span>
      </Link>

      <nav>
        <ul className="nav-links">
          <li><Link to="/">الرئيسية</Link></li>
          <li><Link to="/events">الفعاليات</Link></li>
          <li><Link to="/members">الأعضاء</Link></li>
          <li><Link to="/login" className="login">تسجيل الدخول</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
