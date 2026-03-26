import { Box,Typography,TextField,Button, Snackbar,Alert,MenuItem,} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { tokens } from "../theme";

const AuditLogViewer = () => {
  const API_URL =
    process.env.REACT_APP_API_URL ||"https://biasedly-abjective-brenden.ngrok-free.dev";

  const colors = tokens("dark");

  // ✅ State for logs
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Filters
  const [filters, setFilters] = useState({
    user: "All",
    role: "All",
    startDate: "",
    endDate: "",
  });

  // ✅ Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Snackbar feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  //  Fetch logs with filters + pagination
 const fetchLogs = async () => {
  setLoading(true);
  try {
    const query = new URLSearchParams({
      ...filters,
      page,
      limit: 10,
    }).toString();

    const token = localStorage.getItem("token");

    // Normal JSON fetch for DataGrid
    const res = await axios.get(`${API_URL}/audit-logs?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

         // Inspect the backend response
         console.log("Audit logs response:", res.data);


    setLogs(res.data.logs);        // ✅ populate DataGrid
    setTotalPages(res.data.totalPages);
  } catch (err) {
    console.error("Failed to fetch audit logs:", err);
    setSnackbar({
      open: true,
      message: "Failed to fetch audit logs",
      severity: "error",
    });
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchLogs();
  }, [page]); // reload when page changes

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // ✅ DataGrid columns
  const columns = [
    { field: "timestamp", headerName: "Timestamp", flex: 1 },
    { field: "user", headerName: "User", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "action", headerName: "Action", flex: 1 },
    { field: "details", headerName: "Details", flex: 2 },
  ];

  return (
    <Box m="20px">
      <Header title="AUDIT LOGS" subtitle="Track all system actions" />

      {/* ✅ Filter controls */}
      <Box display="flex" gap="10px" mt="10px" mb="20px">
        <TextField
          select
          label="User"
          name="user"
          value={filters.user}
          onChange={handleChange}
          sx={{ width: "200px" }}
        >
          <MenuItem value="All">All</MenuItem>
          {[...new Set(logs.map((log) => log.user))].map((user) => (
            <MenuItem key={user} value={user}>
              {user}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Role"
          name="role"
          value={filters.role}
          onChange={handleChange}
          sx={{ width: "200px" }}
        >
          <MenuItem value="All">All</MenuItem>
          {[...new Set(logs.map((log) => log.role))].map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.startDate}
          onChange={handleChange}
        />
        <TextField
          label="End Date"
          name="endDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.endDate}
          onChange={handleChange}
        />

        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setPage(1);
            fetchLogs();
          }}
        >
          Apply Filters
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            const query = new URLSearchParams({
              ...filters,
              page,
              limit: 10,
            }).toString();

            const token = localStorage.getItem("token");


           // Open with Authorization header
             window.open(`${API_URL}/audit-logs/export?${query}&token=${token}`, "_blank");
 
            }}

        >
          Export Filtered Logs (CSV)
        </Button>
      </Box>

      {/* ✅ Logs DataGrid */}
      <Box
        m="20px 0"
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          loading={loading}
          rows={logs}
          columns={columns}
          getRowId={(row) => row.id
            // || row.timestamp + row.user
            }
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
        />
      </Box>

      {/* ✅ Pagination controls */}
      <Box display="flex" justifyContent="center" mt="20px" gap="10px">
        <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <Typography>
          Page {page} of {totalPages}
        </Typography>
        <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </Box>

      {/* ✅ Global Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuditLogViewer;