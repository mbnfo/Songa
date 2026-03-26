import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/AdminDashboard";
import Invoices from "./scenes/invoices";
import LoginPage from "./scenes/login";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { ToastContainer } from "react-toastify";
import AuditLogViewer from "./components/AuditLogViewer";
import DriverDashboard from "./scenes/driverDashboard";
import FinanceDashboard from "./scenes/FinanceDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import GlobalErrorBoundary from "./components/GlobalErrorBoundary";
import ManageUsers from "./scenes/ManageUsers";


// 😏Owner Layout
const OwnerLayout = () => (
  <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
    <Sidebar />
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar />
      <Routes>
        <Route path="" element={<Dashboard />} />
        <Route path="manage-users" element={< ManageUsers />} />
        <Route path="invoices" element={<Invoices />} />  

        {/* ✅ Protect Audit Logs */}
        <Route
          path="audit-logs"
          element={
            <ProtectedRoute role="owner">
              <AuditLogViewer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  </div>
);

// ✅ Admin Layout
const AdminLayout = () => (
  <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
    <Sidebar />
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar />
      <Routes>
        <Route path="" element={<Dashboard />} />
        <Route path="manage-users" element={< ManageUsers />} />
        <Route path="invoices" element={<Invoices />} />      
      </Routes>
    </div>
  </div>
);

// 🚗Driver Layout
const DriverLayout = () => {
  const token = localStorage.getItem("token");
  let driverId = null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    driverId = payload.driverId; // claim from backend
  } catch (err) {
    console.error("Failed to decode token:", err);
  }

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        {/* ✅ Pass driverId into dashboard */}
        <DriverDashboard driverId={driverId} />
      </div>
    </div>
  );
};

// ✅ Finance Layout
const FinanceLayout = () => (
  <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
    <Sidebar />
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar />
      <FinanceDashboard />
    </div>
  </div>
);

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
         <GlobalErrorBoundary>
          <Routes>
              {/* Public login page */}
              <Route path="/" element={<LoginPage />} />

              {/* Owner routes */}
              <Route
                path="/owner/*"
                element={
                  <ProtectedRoute role="owner">
                    <OwnerLayout />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute role="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              />

              {/* Driver routes */}
              <Route
                path="/driver"
                element={
                  <ProtectedRoute role="driver">
                    <DriverLayout />
                  </ProtectedRoute>
                }
              />

              {/* Finance routes */}
              <Route
                path="/finance"
                element={
                  <ProtectedRoute role="finance">
                    <FinanceLayout />
                  </ProtectedRoute>
                }
              />
            </Routes>
            
            {/* Toast notifications */}
          <ToastContainer position="top-right" autoClose={3000} />

        </GlobalErrorBoundary>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;