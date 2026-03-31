import { Box, Button, Typography, TextField, Select, MenuItem } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const SupportDashboard = () => {
  const API_URL = process.env.REACT_APP_API_URL || "https://biasedly-abjective-brenden.ngrok-free.dev";
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState({});   // ✅ store resolution notes per issue
  const [reasons, setReasons] = useState({}); // ✅ store escalation reasons per issue

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/support/issues`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let filtered = res.data;

    // ✅ Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((i) => i.status === statusFilter);
    }

    // ✅ Apply search filter (description + resolution notes)
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
  }, [statusFilter, search]);

  // ✅ Resolve issue with custom notes
  const resolveIssue = async (id) => {
    const token = localStorage.getItem("token");
    await axios.post(`${API_URL}/support/issues/${id}/resolve`, 
      { resolutionNotes: "Fixed payout error" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("Issue resolved!");
    fetchIssues();
  };

  // ✅ Escalate issue with custom reason
  const escalateIssue = async (id) => {
    const token = localStorage.getItem("token");
    await axios.post(`${API_URL}/support/issues/${id}/escalate`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert("Issue escalated to Admin!");
    fetchIssues();
  };

  return (
    <Box m="20px">
      <Typography variant="h4">Support Dashboard</Typography>

      {/* Filters */}
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

      {/* Issues list */}
      {issues.map((issue) => (
  <Box key={issue.id} p="10px" borderBottom="1px solid #ccc">
    <Typography>{issue.description}</Typography>
    <Typography>Status: {issue.status}</Typography>

    {/* ✅ Show resolution notes if present */}
    {issue.resolution_notes && (
      <Typography variant="body2" color="textSecondary">
        Resolution Notes: {issue.resolution_notes}
      </Typography>
    )}

    {/* ✅ Show escalation reason if present */}
    {issue.reason && (
      <Typography variant="body2" color="textSecondary">
        Escalation Reason: {issue.reason}
      </Typography>
    )}

    {issue.status === "Open" && (
      <Box display="flex" gap="10px" mt="5px">
        {/* Text field for resolution notes */}
        <TextField
          size="small"
          label="Resolution Notes"
          value={notes[issue.id] || ""}
          onChange={(e) => setNotes({ ...notes, [issue.id]: e.target.value })}
        />
        <Button size="small" onClick={() => resolveIssue(issue.id)}>Resolve</Button>

        {/* Text field for escalation reason */}
        <TextField
          size="small"
          label="Escalation Reason"
          value={reasons[issue.id] || ""}
          onChange={(e) => setReasons({ ...reasons, [issue.id]: e.target.value })}
        />
        <Button size="small" onClick={() => escalateIssue(issue.id)}>Escalate</Button>
      </Box>
    )}
  </Box>


      ))}
    </Box>
  );


};

export default SupportDashboard;
