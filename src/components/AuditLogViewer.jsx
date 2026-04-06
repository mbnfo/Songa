import { Box,Typography,TextField,Button, Snackbar,Alert,MenuItem,useTheme} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { tokens } from "../theme";

const AuditLogViewer = () => {
  const API_URL = process.env.REACT_APP_API_URL ||"https://biasedly-abjective-brenden.ngrok-free.dev";
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
//  const colors = tokens("dark");

  // State for logs
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    user: "All",
    role: "All",
    startDate: "",
    endDate: "",
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Snackbar feedback
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
    }).toString();

    const token = localStorage.getItem("token");

    // Normal JSON fetch for DataGrid
    const res = await axios.get(`${API_URL}/audit-logs?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

         // Inspect the backend response
         console.log("Audit logs response:", res.data);


    setLogs(res.data.logs);        //  populate DataGrid
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

  const uniqueRoles = [...new Set(logs.map((log) => log.role))];
  console.log("Unique roles from logs:", uniqueRoles);

  // DataGrid columns
  const columns = [
    { field: "timestamp", headerName: "Timestamp", flex: 1 },
    { field: "user", headerName: "User", flex: 1 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      headerClassName: "role-header",
      headerAlign: "center",
      align: "center",
    },
    { field: "action", headerName: "Action", flex: 1 },
    { field: "details", headerName: "Details", flex: 2 },
  ];

  return (
    <Box m="20px"  sx={{overflow : "scroll", height: "88vh"}}>
      <Header title="AUDIT LOGS" subtitle="Track all system actions" />

      {/* Filter controls */}
      <Box display="flex" gap="10px" mt="10px" mb="20px">
        <TextField
          select
          label="User"
          name="user"
          value={filters.user}
          onChange={handleChange}
          sx={{
              width: "200px",
              "& .MuiInputLabel-root": {
                color: colors.blueAccent[200], // lighter label
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: colors.blueAccent[300] },
                "&:hover fieldset": { borderColor: colors.blueAccent[400] },
                "&.Mui-focused fieldset": { borderColor: colors.blueAccent[500] },
              },
              "& .MuiSelect-icon": {
                color: colors.blueAccent[200], // dropdown arrow color
              },
            }}
        >
          <MenuItem
              value="All"
              sx={{
                color: colors.grey[100], // light text
                backgroundColor: colors.primary[400], // dark but readable background
                "&:hover": { backgroundColor: colors.blueAccent[700] },
              }}
            >
          All
          </MenuItem>
          {[...new Set(logs.map((log) => log.user))].map((user) => (
           <MenuItem
              key={user}
              value={user}
              sx={{
                color: colors.grey[100],
                backgroundColor: colors.primary[400],
                "&:hover": { backgroundColor: colors.blueAccent[700] },
              }}
            >
              {user}
          </MenuItem>
          ))}

        </TextField>

         {/* Role*/}
        <TextField
            select
            label="Role"
            name="role"
            color="secondary"
            value={filters.role}
            onChange={handleChange}
            sx={{
              width: "200px",
              "& .MuiInputLabel-root": {
                color: colors.blueAccent[200], // lighter label
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: colors.blueAccent[300] },
                "&:hover fieldset": { borderColor: colors.blueAccent[400] },
                "&.Mui-focused fieldset": { borderColor: colors.blueAccent[500] },
              },
              "& .MuiSelect-icon": {
                color: colors.blueAccent[200], // dropdown arrow color
              },
            }}
          >
            <MenuItem
              value="All"
              sx={{
                color: colors.grey[100], // light text
                backgroundColor: colors.primary[400], // dropdown background
                "&:hover": { backgroundColor: colors.blueAccent[700] },
              }}
            >
              All
            </MenuItem>

            {uniqueRoles.map((role) => (
              <MenuItem
                key={role}
                value={role}
                sx={{
                  color: colors.grey[100],
                  backgroundColor: colors.primary[400],
                  "&:hover": { backgroundColor: colors.blueAccent[700] },
                }}
              >
                {role}
              </MenuItem>
            ))}
          </TextField>


        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          color="secondary"
          InputLabelProps={{ shrink: true }}
          value={filters.startDate}
          onChange={handleChange}
        />
        <TextField
          label="End Date"
          name="endDate"
          type="date"
          color="secondary"
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
 
            }}  >


          Export Filtered Logs (CSV)
        </Button>
      </Box>

      {/* Logs DataGrid */}
      <Box
        m="20px 0"
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700], // change this to your desired color
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeader.role-header": {
            backgroundColor: colors.grey[800],
            color: colors.grey[100],
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          border:  "1px solid #ddd",
         boxShadow:   "0px 4px 12px rgba(0,0,0,0.8)",
        }}
      >
        <DataGrid
          loading={loading}
          rows={logs}
          columns={columns}
          getRowId={(row) => row.id
            }
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
           sx={{
              "& .MuiTablePagination-root": {
                color: "#c2c2c2", // changes "Rows per page" text color
              },
              "& .MuiTablePagination-selectLabel": {
                color: "#c2c2c2", // label before dropdown
              },
              "& .MuiTablePagination-displayedRows": {
                color: "#c2c2c2", // "1–10 of 100" text
              },
              "& .MuiTablePagination-actions button": {
                color: "#c2c2c2", // pagination arrows
              },
            }}
             hideFooter
        />
      </Box>

      {/* Pagination controls */}
      <Box display="flex" justifyContent="center" mt="20px" gap="10px">
        <Button disabled={page <= 1} 
          sx={{
      color: "#e0e0e0",              // text color
      border: "1px solid #e0e0e0",   // optional border for visibility
      "&:disabled": {
        color: "#888888",            // greyed out when disabled
        borderColor: "#888888",
      },
    }}
        onClick={() => setPage(page - 1) }>
          Previous
        </Button>
        <Typography color="secondary">
          Page {page} of {totalPages}
        </Typography>
        <Button disabled={page >= totalPages}
          sx={{
      color: "#e0e0e0",              // text color
      border: "1px solid #e0e0e0",   // optional border for visibility
      "&:disabled": {
        color: "#888888",            // greyed out when disabled
        borderColor: "#888888",
      },
    }}
         onClick={() => setPage(page + 1)}
         >
          Next
        </Button>
      </Box>

      {/* Global Snackbar */}
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