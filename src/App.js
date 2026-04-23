import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Bottombar from "./scenes/global/Bottombar";
import Dashboard from "./scenes/AdminDashboard";
import Invoices from "./scenes/invoices";
import LoginPage from "./scenes/login";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { ToastContainer } from "react-toastify";
import AuditLogViewer from "./components/AuditLogViewer";
import DriverDashboard from "./scenes/driverDashboard";
import FinanceDashboard from "./scenes/FinanceDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import GlobalErrorBoundary from "./components/GlobalErrorBoundary";
import ManageUsers from "./scenes/ManageUsers";
import SupportDashboard from "./scenes/SupportDashboard";
import SupportPage from "./scenes/SupportPage";




// 😏Owner Layout
const OwnerLayout = () => (
  <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
  <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
    <Sidebar />
  </Box>
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar />
      <Routes>
        <Route path="" element={<Dashboard />} />
        <Route path="manage-users" element={< ManageUsers />} />
        
        
{/*  <Route path="finance" element={<FinanceDashboard />} />      */}
        {/*  Protect Audit Logs */}
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
    <Bottombar/>
  </div>
);

//  Admin Layout
const AdminLayout = () => (
  <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
  <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
    <Sidebar />
  </Box>
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar />
      <Routes>
        <Route path="" element={<Dashboard />} />
        <Route path="manage-users" element={< ManageUsers />} />
        <Route path="invoices" element={<Invoices />} />      
      </Routes>
    </div>
    <Bottombar/>
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
  <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
    <Sidebar />
  </Box>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        {/*  Pass driverId into dashboard */}
        {/*  Pass driverId into dashboard */}
        <DriverDashboard driverId={driverId} />
      </div>
      <Bottombar/>
    </div>
  );
};

//  Finance Layout
const FinanceLayout = () => (
  <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
  <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
    <Sidebar />
  </Box>
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar />
      <FinanceDashboard />
      <Bottombar/>
    </div>
  </div>
);

//  Support Staff Layout
const SupportStaffLayout = () => (
  <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
  <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
    <Sidebar />
  </Box>
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar />
      <SupportDashboard />
      <Bottombar/>
    </div>
  </div>
);

//  Support Page Layout
const SupportPageLayout = () => (
  <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
  <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
    <Sidebar />
  </Box>
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Topbar />
      <SupportPage />
      <Bottombar/>
    </div>
  </div>
);



function App() {
  const [theme, colorMode] = useMode();
 // const [isSidebar, setIsSidebar] = useState(true);

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
                  <ProtectedRoute role={["finance", "owner"]}>
                    <FinanceLayout />
                  </ProtectedRoute>
                }
              />

              {/* Support staff */}
              <Route
                path="/support"
                element={
                  <ProtectedRoute role="support">
                    <SupportStaffLayout />
                  </ProtectedRoute>
                }
              />
              
              {/* Support page */}
              <Route
                path="/support/issues"
                element={
                  <SupportPageLayout />
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