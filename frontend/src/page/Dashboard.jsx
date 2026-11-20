import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminBookings from "../componant/admin/AdminBookings";
import AdminEvents from "../componant/admin/AdminEvents";
import AdminMembers from "../componant/admin/AdminMembers";
import AdminFeedback from "../componant/admin/AdminFeedback";
import AdminAdmins from "../componant/admin/AdminAdmins";
import "./Dashboard.css";

const tabs = [
  { id: "bookings", label: "الحجوزات", Component: AdminBookings },
  { id: "events", label: "الفعاليات", Component: AdminEvents },
  { id: "members", label: "الأعضاء", Component: AdminMembers },
  { id: "feedback", label: "الفيدباك", Component: AdminFeedback },
  { id: "admins", label: "الأدمن", Component: AdminAdmins },
];

function Dashboard() {
  const [activeTab, setActiveTab] = useState("bookings");
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin"));

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/login");
  };

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab).Component;

  return (
    <main className="dashboard-page">
      <div className="dashboard-top">
        <h1>Dashboard</h1>
        <div className="dashboard-user">
          <span>أهلاً، {admin.name}</span>
          <button onClick={logout}>تسجيل خروج</button>
        </div>
      </div>

      <nav className="dashboard-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={tab.id === activeTab ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <ActiveComponent />
    </main>
  );
}

export default Dashboard;
