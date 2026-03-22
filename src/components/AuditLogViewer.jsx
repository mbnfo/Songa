import { Box, Typography, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

const AuditLogViewer = () => {
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://biasedly-abjective-brenden.ngrok-free.dev";

  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    user: "",
    role: "",
    startDate: "",
    endDate: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Fetch logs with filters + pagination
  const fetchLogs = async () => {
    try {
      const query = new URLSearchParams({ ...filters, page, limit: 10 }).toString();
      const res = await axios.get(`${API_URL}/audit-logs?${query}`);
      setLogs(res.data.logs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]); // reload when page changes

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Box m="20px">
      <Typography variant="h4">Audit Logs</Typography>

      {/* ✅ Filter controls */}
      <Box display="flex" gap="10px" mt="10px" mb="20px">
        <TextField label="User" name="user" value={filters.user} onChange={handleChange} />
        <TextField label="Role" name="role" value={filters.role} onChange={handleChange} />
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
        <Button variant="contained" color="secondary" onClick={() => { setPage(1); fetchLogs(); }}>
          Apply Filters
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            const query = new URLSearchParams({ ...filters, page, limit: 10 }).toString();
            window.open(`${API_URL}/audit-logs/export?${query}`, "_blank");
          }}
        >
          Export Filtered Logs (CSV)
        </Button>
      </Box>

      {/* ✅ Logs table */}
      {logs.map((log, i) => (
        <Box key={i} display="flex" justifyContent="space-between" p="10px" borderBottom="1px solid #ccc">
          <Typography>{log.timestamp}</Typography>
          <Typography>{log.user} ({log.role})</Typography>
          <Typography>{log.action} - {log.details}</Typography>
        </Box>
      ))}

      {/* ✅ Pagination controls */}
      <Box display="flex" justifyContent="center" mt="20px" gap="10px">
        <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
        <Typography>Page {page} of {totalPages}</Typography>
        <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
      </Box>
    </Box>
  );
};

export default AuditLogViewer;