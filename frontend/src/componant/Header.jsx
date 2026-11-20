import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <Link to="/" className="brand">
        <img src="/logo.png" alt="شعار مهام" className="brand-img" />
      </Link>

      <nav className="nav">
        <ul className="nav-links">
          <li><Link to="/">الرئيسية</Link></li>
          <li><Link to="/events">الفعاليات</Link></li>
          <li><Link to="/members">الأعضاء</Link></li>
          <li><Link to="/book">احجز فعاليتك</Link></li>
        </ul>
      </nav>

      <Link to="/dashboard" className="dashboard-btn">Dashboard</Link>
    </header>
  );
}

export default Header;
