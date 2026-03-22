import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PieChart from "../../components/PieChart";
import LineChart from "../../components/LineChart";

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const API_URL = process.env.REACT_APP_API_URL || "https://biasedly-abjective-brenden.ngrok-free.dev";

  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    if (role !== "finance") {
      alert("Access denied: Finance role required");
      navigate("/");
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/finance/payout-history`);
        setPayouts(res.data);
      } catch (err) {
        console.error("Failed to fetch payout history:", err);
      }
    };

    fetchHistory();
  }, [role, navigate, API_URL]);

  const exportCSV = () => {
    window.open(`${API_URL}/finance/export-payouts`, "_blank");
  };

  const markPaid = async (driverId, week) => {
    try {
      await axios.post(`${API_URL}/finance/mark-paid`, { driverId, week });
      alert("Payout marked as paid!");
      const res = await axios.get(`${API_URL}/finance/payout-history`);
      setPayouts(res.data);
    } catch (err) {
      console.error("Failed to mark payout:", err);
    }
  };

  // ✅ Analytics
  const totalNet = payouts.reduce((sum, p) => sum + Number(p.net || 0), 0);
  const pendingNet = payouts
    .filter((p) => p.payout_status === "Pending")
    .reduce((sum, p) => sum + Number(p.net || 0), 0);
  const paidNet = payouts
    .filter((p) => p.payout_status === "Paid")
    .reduce((sum, p) => sum + Number(p.net || 0), 0);

  // ✅ Pie chart data
  const pieData = [
    { id: "Pending", label: "Pending", value: pendingNet },
    { id: "Paid", label: "Paid", value: paidNet },
  ];

  // ✅ Line chart data (weekly totals)
  const weeklyTotals = payouts.reduce((acc, p) => {
    if (!acc[p.week]) acc[p.week] = 0;
    acc[p.week] += Number(p.net || 0);
    return acc;
  }, {});
  const lineData = [
    {
      id: "Weekly Net Payouts",
      color: "hsl(220, 70%, 50%)",
      data: Object.entries(weeklyTotals).map(([week, net]) => ({
        x: week,
        y: net,
      })),
    },
  ];

  return (
    <Box m="20px">
      <Typography variant="h4">Finance Dashboard</Typography>

      {/* ✅ Export button */}
      <Button variant="contained" color="secondary" onClick={exportCSV}>
        Export Pending Payouts (CSV)
      </Button>

      {/* ✅ Summary Stats */}
      <Box mt="20px" display="flex" gap="20px">
        <Typography>Total Net: ${totalNet.toFixed(2)}</Typography>
        <Typography>Pending: ${pendingNet.toFixed(2)}</Typography>
        <Typography>Paid: ${paidNet.toFixed(2)}</Typography>
      </Box>

      {/* ✅ Charts */}
      <Box mt="40px" backgroundColor="#1f2a40" p="20px">
        <Typography variant="h5">Pending vs Paid</Typography>
        <Box height="250px">
          <PieChart isDashboard={true} data={pieData} />
        </Box>
      </Box>

      <Box mt="40px" backgroundColor="#1f2a40" p="20px">
        <Typography variant="h5">Weekly Net Payouts</Typography>
        <Box height="250px">
          <LineChart isDashboard={true} data={lineData} />
        </Box>
      </Box>

      {/* ✅ Payout history table */}
      <Box mt="40px">
        <Typography variant="h5">Payout History</Typography>
        {payouts.map((p, i) => (
          <Box
            key={i}
            display="flex"
            justifyContent="space-between"
            p="10px"
            borderBottom="1px solid #ccc"
          >
            <Typography>
              Driver {p.driver_id} - Week {p.week}
            </Typography>
            <Typography>Net: ${p.net}</Typography>
            <Typography>Status: {p.payout_status}</Typography>
            {p.payout_status === "Pending" && (
              <Button size="small" onClick={() => markPaid(p.driver_id, p.week)}>
                Mark Paid
              </Button>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FinanceDashboard;