import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const DriverSupportDashboard = ({ driverId }) => {
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://biasedly-abjective-brenden.ngrok-free.dev";

  const [issues, setIssues] = useState([]);

  // ✅ Fetch only this driver’s issues
  const fetchDriverIssues = async () => {
    try {
      const token = localStorage.getItem("token"); // include JWT
      const res = await axios.get(`${API_URL}/support/issues/driver/${driverId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssues(res.data);
    } catch (err) {
      console.error("Failed to fetch driver issues:", err);
    }
  };

  useEffect(() => {
    fetchDriverIssues();
  }, [driverId]);

  return (
    <Box m="20px">
      <Typography variant="h4">My Support Issues</Typography>

      {/* ✅ List driver’s own issues */}
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

          <Typography variant="caption" color="textSecondary">
            Created: {new Date(issue.created_at).toLocaleString()}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default DriverSupportDashboard;
