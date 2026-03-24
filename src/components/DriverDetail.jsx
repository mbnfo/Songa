import { Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LineChart from "../../components/LineChart"; // ✅ Reuse your existing chart component

const DriverDetail = () => {
  // ✅ Get driver ID from route params
  const { id } = useParams();
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://biasedly-abjective-brenden.ngrok-free.dev";

  // ✅ State for driver profile and earnings
  const [driver, setDriver] = useState(null);
  const [earnings, setEarnings] = useState([]);

  // ✅ Fetch driver details + earnings on mount
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/drivers/${id}`);
        setDriver(res.data.driver);
        setEarnings(res.data.earnings);
      } catch (err) {
        console.error("Failed to fetch driver details:", err);
      }
    };
    fetchDriver();
  }, [id, API_URL]);

  // ✅ Prepare data for line chart
  const lineData = [
    {
      id: "Net Earnings",
      color: "hsl(120, 70%, 50%)",
      data: earnings.map((e) => ({ x: e.week, y: e.net })),
    },
  ];

  // ✅ Show loading state until driver data is ready
  if (!driver) return <Typography>Loading driver details...</Typography>;

  return (
    <Box m="20px">
      <Typography variant="h4">Driver Detail</Typography>

      {/* ✅ Driver Profile Section */}
      <Box mt="20px">
        <Typography><strong>Name:</strong> {driver.first_name} {driver.last_name}</Typography>
        <Typography><strong>Vehicle ID:</strong> {driver.vehicle_id}</Typography>
        <Typography><strong>Email:</strong> {driver.email}</Typography>
        <Typography><strong>Cell:</strong> {driver.cell_number}</Typography>
        <Typography><strong>Status:</strong> {driver.status}</Typography>
      </Box>

      {/* ✅ Earnings Chart Section */}
      <Box mt="40px" backgroundColor="#1f2a40" p="20px" borderRadius="8px">
        <Typography variant="h5">Weekly Net Earnings</Typography>
        <Box height="250px">
          <LineChart isDashboard={true} data={lineData} />
        </Box>
      </Box>

      {/* ✅ PDF Statement Download */}
      <Box mt="20px">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => window.open(`${API_URL}/driver-statement/${id}`, "_blank")}
        >
          Download PDF Statement
        </Button>
      </Box>
    </Box>
  );
};

export default DriverDetail;