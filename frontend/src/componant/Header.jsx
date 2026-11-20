import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/events?q=${encodeURIComponent(q)}` : "/events");
    setSearch("");
  };

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

      <form className="header-search" onSubmit={handleSearch} role="search">
        <input
          type="search"
          placeholder="ابحث عن فعالية..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="ابحث عن فعالية"
        />
        <button type="submit">بحث</button>
      </form>

      <Link to="/dashboard" className="dashboard-btn">Dashboard</Link>
    </header>
  );
}

export default Header;
