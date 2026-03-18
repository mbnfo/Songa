import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("ProtectedRoute payload:", payload, "expected role:", role);

    // ✅ Expired token check
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      localStorage.removeItem("token");
      return <Navigate to="/" replace state={{ sessionExpired: true }} />;
    }

    // ✅ Role check
    if (role && payload.role.toLowerCase() !== role.toLowerCase()) {
      // Redirect to their own dashboard instead of just "/"
      switch (payload.role.toLowerCase()) {
        case "admin":
          return <Navigate to="/admin" replace />;
        case "driver":
          return <Navigate to="/driver" replace />;
        case "support":
          return <Navigate to="/support" replace />;
        case "finance":
          return <Navigate to="/finance" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }

    return children;
  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;