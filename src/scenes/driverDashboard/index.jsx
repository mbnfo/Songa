import { Box, Typography, useTheme, Button } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import PieChart from "../../components/PieChart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useEffect, useState } from "react";
import axios from "axios";

const DriverDashboard = ({ driverId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const username = localStorage.getItem("username") || "Driver";

  const [driverData, setDriverData] = useState([]);

  // ✅ Fetch only this driver’s data
  useEffect(() => {
    const API_URL =
      process.env.REACT_APP_API_URL ||
      "https://biasedly-abjective-brenden.ngrok-free.dev";

    const fetchDriverData = async () => {
      try {
        const res = await axios.get(`${API_URL}/driver-dashboard/${driverId}`);
        setDriverData(res.data || []);
      } catch (err) {
        console.error("Failed to fetch driver data:", err);
      }
    };
    fetchDriverData();
  }, [driverId]);

  // ✅ Compute stats
  const totalGross = driverData.reduce(
    (sum, row) => sum + Number(row.gross || 0),
    0
  );
  const totalNet = driverData.reduce(
    (sum, row) => sum + Number(row.net || 0),
    0
  );

  // ✅ Weekly totals for line chart
  const weeklyTotals = driverData.reduce((acc, row) => {
    const week = row.week || row.Week;
    if (!week) return acc;
    if (!acc[week]) acc[week] = { gross: 0, net: 0 };
    acc[week].gross += Number(row.gross || 0);
    acc[week].net += Number(row.net || 0);
    return acc;
  }, {});

  const lineData = [
    {
      id: "Gross Earnings",
      color: "hsl(220, 70%, 50%)",
      data: Object.entries(weeklyTotals).map(([week, values]) => ({
        x: week,
        y: values.gross,
      })),
    },
    {
      id: "Net Earnings",
      color: "hsl(120, 70%, 50%)",
      data: Object.entries(weeklyTotals).map(([week, values]) => ({
        x: week,
        y: values.net,
      })),
    },
  ];

  // ✅ Pie chart: breakdown by week
  const pieData = Object.entries(weeklyTotals).map(([week, values]) => ({
    id: week,
    label: week,
    value: values.net,
  }));

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://biasedly-abjective-brenden.ngrok-free.dev";

  // ✅ GDPR: Download My Data
  const handleDownloadData = async () => {
    try {
      const res = await axios.get(`${API_URL}/driver/data/${driverId}`);
      const blob = new Blob([JSON.stringify(res.data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `driver_${driverId}_data.json`;
      link.click();
    } catch (err) {
      console.error("Failed to download driver data:", err);
    }
  };

  // ✅ GDPR: Delete My Account
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/driver/delete/${driverId}`);
      alert("Your account has been deleted. You will be logged out.");
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      console.error("Failed to delete account:", err);
      alert("Failed to delete account.");
    }
  };

  return (
    <Box m="20px">
      <Header title="Driver Dashboard" subtitle={`Welcome, ${username}`} />

      {/* Stat Boxes */}
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`$${totalGross.toFixed(2)}`}
            subtitle="Gross Earnings"
            progress="0.75"
            increase="+14%"
            icon={
              <AttachMoneyIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`$${totalNet.toFixed(2)}`}
            subtitle="Net Earnings"
            progress="0.50"
            increase="+21%"
            icon={
              <AccountBalanceWalletIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
          <Typography variant="h5" color={colors.greenAccent[400]} sx={{ mt: 1 }}>
            Total amount after deductions
          </Typography>
        </Box>
      </Box>

      {/* Line Chart */}
      <Box mt="40px" backgroundColor={colors.primary[400]} p="20px">
        <Typography variant="h5" fontWeight="600">
          Weekly Earnings
        </Typography>
        <Box height="250px">
          <LineChart isDashboard={true} data={lineData} />
        </Box>
      </Box>

      {/* Pie Chart */}
      <Box mt="40px" backgroundColor={colors.primary[400]} p="20px">
        <Typography variant="h5" fontWeight="600">
          Net Earnings Breakdown by Week
        </Typography>
        <Box height="250px">
          <PieChart isDashboard={true} data={pieData} />
        </Box>
      </Box>

      {/* PDF Download */}
      <Box mt="20px">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            window.open(`${API_URL}/driver-statement/${driverId}`, "_blank");
          }}
        >
          Download PDF Statement
        </Button>
      </Box>

      {/* GDPR Buttons */}
      <Box mt="20px" display="flex" gap="10px">
        <Button variant="outlined" color="primary" onClick={handleDownloadData}>
          Download My Data (JSON)
        </Button>
        <Button variant="outlined" color="error" onClick={handleDeleteAccount}>
          Delete My Account
        </Button>
      </Box>
    </Box>
  );
};

export default DriverDashboard;