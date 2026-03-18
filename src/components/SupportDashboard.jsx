import { Box, Button, Typography, TextField, Select, MenuItem } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const SupportDashboard = () => {
  const API_URL = process.env.REACT_APP_API_URL || "https://biasedly-abjective-brenden.ngrok-free.dev";
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Fetch issues
  const fetchIssues = async () => {
    try {
      const res = await axios.get(`${API_URL}/support/issues`);
      let filtered = res.data;
      if (statusFilter !== "All") filtered = filtered.filter((i) => i.status === statusFilter);
      if (search.trim()) {
        filtered = filtered.filter(
          (i) =>
            i.description.toLowerCase().includes(search.toLowerCase()) ||
            (i.resolution_notes || "").toLowerCase().includes(search.toLowerCase())
        );
      }
      setIssues(filtered);
    } catch (err) {
      console.error("Failed to fetch issues:", err);
    }
  };

  // ✅ Fetch support audit logs with pagination
  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/support/audit-logs`, {
        params: { page, limit },
      });
      setLogs(res.data.logs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchLogs();
  }, [statusFilter, search, page, limit]);

  const resolveIssue = async (id) => {
    await axios.post(`${API_URL}/support/issues/${id}/resolve`, { resolutionNotes: "Fixed payout error" });
    alert("Issue resolved!");
    fetchIssues();
    fetchLogs();
  };

  const escalateIssue = async (id) => {
    await axios.post(`${API_URL}/support/issues/${id}/escalate`);
    alert("Issue escalated to Admin!");
    fetchIssues();
    fetchLogs();
  };

  return (
    <Box m="20px">
      <Typography variant="h4">Support Dashboard</Typography>

      {/* ✅ Filters */}
      <Box display="flex" gap="10px" mt="10px" mb="20px">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Open">Open</MenuItem>
          <MenuItem value="Resolved">Resolved</MenuItem>
          <MenuItem value="Escalated">Escalated</MenuItem>
        </Select>
        <TextField label="Search issues" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button variant="contained" color="secondary" onClick={fetchIssues}>Refresh</Button>
      </Box>

      {/* ✅ Issues list */}
      {issues.map((issue) => (
        <Box key={issue.id} display="flex" justifyContent="space-between" p="10px" borderBottom="1px solid #ccc">
          <Typography>{issue.description}</Typography>
          <Typography>Status: {issue.status}</Typography>
          {issue.status === "Open" && (
            <>
              <Button size="small" onClick={() => resolveIssue(issue.id)}>Resolve</Button>
              <Button size="small" onClick={() => escalateIssue(issue.id)}>Escalate</Button>
            </>
          )}
        </Box>
      ))}

      {/* ✅ Support Audit Logs */}
      <Box mt="40px">
        <Typography variant="h5">My Recent Actions</Typography>
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
          <Select value={limit} onChange={(e) => { setLimit(e.target.value); setPage(1); }}>
            <MenuItem value={10}>10 per page</MenuItem>
            <MenuItem value={20}>20 per page</MenuItem>
            <MenuItem value={50}>50 per page</MenuItem>
          </Select>
        </Box>

        {/* ✅ Export CSV */}
        <Box display="flex" justifyContent="center" mt="20px">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => window.open(`${API_URL}/support/audit-logs/export`, "_blank")}
          >
            Export All Support Logs (CSV)
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SupportDashboard;