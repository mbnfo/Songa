import { Box, Button, Typography, TextField, Select, MenuItem } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const SupportDashboard = () => {
  const API_URL = process.env.REACT_APP_API_URL || "https://biasedly-abjective-brenden.ngrok-free.dev";
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All"); // ✅ filter by status
  const [search, setSearch] = useState(""); // ✅ free-text search

  // ✅ Fetch issues with filters
  const fetchIssues = async () => {
    try {
      const res = await axios.get(`${API_URL}/support/issues`);
      let filtered = res.data;

      // ✅ Apply status filter
      if (statusFilter !== "All") {
        filtered = filtered.filter((i) => i.status === statusFilter);
      }

      // ✅ Apply free-text search (description + resolution notes)
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

  useEffect(() => {
    fetchIssues();
  }, [statusFilter, search]); // ✅ re-fetch when filters change

  // ✅ Resolve issue
  const resolveIssue = async (id) => {
    await axios.post(`${API_URL}/support/issues/${id}/resolve`, { resolutionNotes: "Fixed payout error" });
    alert("Issue resolved!");
    fetchIssues();
  };

  // ✅ Escalate issue
  const escalateIssue = async (id) => {
    await axios.post(`${API_URL}/support/issues/${id}/escalate`);
    alert("Issue escalated to Admin!");
    fetchIssues();
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
        <TextField
          label="Search issues"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" color="secondary" onClick={fetchIssues}>
          Refresh
        </Button>
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
    </Box>
  );
};

export default SupportDashboard;