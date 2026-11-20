import { Navigate } from "react-router-dom";

// بيلفّ أي صفحة بدها أدمن: إذا مش داخل، بيحوّله لصفحة تسجيل الدخول
function RequireAdmin({ children }) {
  const admin = localStorage.getItem("admin");

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequireAdmin;
