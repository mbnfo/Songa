import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./scenes/login";
import AdminDashboard from "./scenes/AdminDashboard"; 
import DriverDashboard from "./scenes/driverDashboard";
import AppSidebar from "./scenes/global/Sidebar";
import Topbar from "./scenes/global/Topbar";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Add these imports
import Contacts from "./scenes/contacts";
import Form from "./scenes/form";
import Invoices from "./scenes/invoices";

const AdminLayout = () => (
  <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
    <AppSidebar />
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar />
      <Routes>
        {/* Default admin dashboard */}
        <Route path="" element={<AdminDashboard />} />
        {/* Nested admin pages */}
        <Route path="contacts" element={<Contacts />} />
        <Route path="form" element={<Form />} />
        <Route path="invoices" element={<Invoices />} />
      </Routes>
    </div>
  </div>
);

const DriverLayout = () => (
  <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
    <AppSidebar />
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar />
      <DriverDashboard />
    </div>
  </div>
);

function aApp() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LoginPage />} />

      {/* Admin with nested routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      />

      {/* Driver */}
      <Route
        path="/driver"
        element={
          <ProtectedRoute role="driver">
            <DriverLayout />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default aApp;