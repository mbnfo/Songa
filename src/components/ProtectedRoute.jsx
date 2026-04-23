import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("Decoded JWT payload:", payload);

    // ✅ Expired token check
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      localStorage.removeItem("token");
      return <Navigate to="/" replace state={{ sessionExpired: true }} />;
    }

    // ✅ Normalize roles
    const allowedRoles = Array.isArray(role)
      ? role.map(r => r.toLowerCase())
      : [role.toLowerCase()];

    const userRole = payload.role?.toLowerCase(); // use role from token directly

    console.log("ProtectedRoute payload:", payload);
    console.log("Allowed roles:", allowedRoles);
    console.log("Redirect reason: ",
                  {
                    token,  expired: payload.exp && Date.now() >= payload.exp * 1000,
                    userRole,  allowedRoles
                  });



    if (!allowedRoles.includes(userRole)) {
      // Redirect to their own dashboard
      switch (userRole) {
        case "admin":
          return <Navigate to="/admin" replace />;
        case "driver":
          return <Navigate to="/driver" replace />;
        case "support":
          return <Navigate to="/support" replace />;
        case "finance":
          return <Navigate to="/finance" replace />;
        case "owner":
          return <Navigate to="/owner" replace />;
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
