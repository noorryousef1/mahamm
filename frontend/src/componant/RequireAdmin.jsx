import { Navigate } from "react-router-dom";
import useAdmin from "../useAdmin";

function RequireAdmin({ children }) {
  const { loading, admin } = useAdmin();

  if (loading) {
    return <p className="dashboard-status">جاري التحميل...</p>;
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children(admin);
}

export default RequireAdmin;
