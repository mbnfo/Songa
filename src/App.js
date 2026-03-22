import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import AdminDashboard from "./scenes/AdminDashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import  Form  from "./scenes/form";
import LoginPage from "./scenes/login";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { ToastContainer } from "react-toastify";
import AuditLogViewer from "./components/AuditLogViewer";

import DriverDashboard from "./scenes/driverDashboard";
import ProtectedRoute from "./components/ProtectedRoute";



const AdminLayout = () => (
  <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
    <Sidebar />
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar />
      <Routes>
        {/* Default admin dashboard */}
        <Route path="" element={<AdminDashboard />} />
        {/* Nested admin pages */}
        <Route path="contacts" element={<Contacts />} />
        <Route path="form" element={<Form />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="audit-logs" element={<AuditLogViewer />} />
      </Routes>
    </div>
  </div>
);

const DriverLayout = () => (
  <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
    <Sidebar />
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar />
      <DriverDashboard />
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
        <Routes>
          {/* Public login page (no sidebar/topbar) */}
          <Route path="/" element={<LoginPage />} />

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
        </Routes>

        {/* Toast notifications */}
        <ToastContainer position="top-right" autoClose={3000} />

      </ThemeProvider>
    </ColorModeContext.Provider>
  );

}

export default App;
