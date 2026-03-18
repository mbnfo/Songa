import { Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LineChart from "../../components/LineChart";

const DriverDetail = () => {
  const { id } = useParams(); // driverId from route
  const API_URL = process.env.REACT_APP_API_URL || "https://biasedly-abjective-brenden.ngrok-free.dev";

  const [driver, setDriver] = useState(null);
  const [earnings, setEarnings] = useState([]);

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
  }, [id]);

  // ✅ Line chart data
  const lineData = [
    {
      id: "Net Earnings",
      color: "hsl(120, 70%, 50%)",
      data: earnings.map((e) => ({ x: e.week, y: e.net })),
    },
  ];

  if (!driver) return <Typography>Loading...</Typography>;

  return (
    <Box m="20px">
      <Typography variant="h4">Driver Detail</Typography>

      {/* Driver Profile */}
      <Box mt="20px">
        <Typography>Name: {driver.first_name} {driver.last_name}</Typography>
        <Typography>Vehicle ID: {driver.vehicle_id}</Typography>
        <Typography>City: {driver.city}</Typography>
        <Typography>Email: {driver.email}</Typography>
        <Typography>Cell: {driver.cell_number}</Typography>
      </Box>

      {/* Earnings Chart */}
      <Box mt="40px" backgroundColor="#1f2a40" p="20px">
        <Typography variant="h5">Weekly Net Earnings</Typography>
        <Box height="250px">
          <LineChart isDashboard={true} data={lineData} />
        </Box>
      </Box>

      {/* PDF Statement Download */}
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