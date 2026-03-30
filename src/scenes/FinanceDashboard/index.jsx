import { Box, Button,Typography,Snackbar,Alert,TextField} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PieChart from "../../components/PieChart";
import LineChart from "../../components/LineChart";
import { tokens } from "../../theme";

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const API_URL =
    process.env.REACT_APP_API_URL || "https://biasedly-abjective-brenden.ngrok-free.dev";

  const colors = tokens("dark");

  //  State for payouts
  const [payouts, setPayouts] = useState([]);
  // Snackbar feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  //  Loading state
  const [loading, setLoading] = useState(false);
  //  Date range filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //  Fetch payout history
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/finance/payout-history`, {
        params: { startDate, endDate },
      });
      setPayouts(res.data);
    } catch (err) {
      console.error("Failed to fetch payout history:", err);
      setSnackbar({
        open: true,
        message: "Failed to fetch payout history",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role !== "finance" && role !==  "owner") {
      setSnackbar({
        open: true,
        message: "Access denied: Finance or Owner role required",
        severity: "error",
      });
      navigate("/");
      return;
    }
    fetchHistory();
  }, [role, navigate, API_URL]);

  //  Export CSV
  const exportCSV = () => {
    window.open(
      `${API_URL}/finance/export-payouts?startDate=${startDate}&endDate=${endDate}`,
      "_blank"
    );
  };

  //  Mark payout as paid
  const markPaid = async (driverId, week) => {
    try {
      await axios.post(`${API_URL}/finance/mark-paid`, { driverId, week });
      setSnackbar({
        open: true,
        message: "Payout marked as paid!",
        severity: "success",
      });
      fetchHistory();
    } catch (err) {
      console.error("Failed to mark payout:", err);
      setSnackbar({
        open: true,
        message: "Failed to mark payout",
        severity: "error",
      });
    }
  };

  //  Analytics
  const totalNet = payouts.reduce((sum, p) => sum + Number(p.net || 0), 0);
  const totalCommission = payouts.reduce(
    (sum, p) => sum + Number(p.commission || 0),
    0
  );
  const totalGross = payouts.reduce((sum, p) => sum + Number(p.gross || 0), 0);

  const pendingNet = payouts
    .filter((p) => p.payout_status === "Pending")
    .reduce((sum, p) => sum + Number(p.net || 0), 0);
  const paidNet = payouts
    .filter((p) => p.payout_status === "Paid")
    .reduce((sum, p) => sum + Number(p.net || 0), 0);

  //  Pie chart data (Pending vs Paid)
  const pieData = [
    { id: "Pending", label: "Pending", value: pendingNet },
    { id: "Paid", label: "Paid", value: paidNet },
  ];

  //  Commission breakdown chart data
  const commissionData = [
    { id: "Commission", label: "Commission", value: totalCommission },
    { id: "Net Earnings", label: "Net Earnings", value: totalNet },
  ];

  //  Line chart data (weekly totals)
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

  //  DataGrid columns
  const columns = [
    { field: "driver_id", headerName: "Driver ID", flex: 1 },
    { field: "week", headerName: "Week", flex: 1 },
    { field: "gross", headerName: "Gross", flex: 1 },
    { field: "commission", headerName: "Commission", flex: 1 },
    { field: "net", headerName: "Net", flex: 1 },
    { field: "payout_status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) =>
        params.row.payout_status === "Pending" ? (
          <Button
            size="small"
            onClick={() => markPaid(params.row.driver_id, params.row.week)}
          >
            Mark Paid
          </Button>
        ) : null,
    },
  ];

  return (
    <Box m="20px">
      <Typography variant="h4">Finance Dashboard</Typography>

      {/*  Date Range Filter */}
      <Box mt="20px" display="flex" gap="20px" alignItems="center">
        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button variant="contained" onClick={fetchHistory}>
          Apply Filter
        </Button>
      </Box>

      {/*  Export button */}
      <Button
        variant="contained"
        color="secondary"
        onClick={exportCSV}
        sx={{ mt: 2 }}
      >
        Export Payouts (CSV)
      </Button>

      {/*  Summary Cards */}
      <Box mt="20px" display="flex" gap="20px">
        <Box p="20px" bgcolor={colors.primary[400]} borderRadius="8px">
          <Typography variant="h6">Total Gross</Typography>
          <Typography variant="h5">${totalGross.toFixed(2)}</Typography>
        </Box>
        <Box p="20px" bgcolor={colors.greenAccent[600]} borderRadius="8px">
          <Typography variant="h6">Total Commission</Typography>
          <Typography variant="h5">${totalCommission.toFixed(2)}</Typography>
        </Box>
        <Box p="20px" bgcolor={colors.blueAccent[600]} borderRadius="8px">
          <Typography variant="h6">Total Net</Typography>
          <Typography variant="h5">${totalNet.toFixed(2)}</Typography>
        </Box>
      </Box>

      

      {/* Charts */}
        <Box mt="40px" backgroundColor="#1f2a40" p="20px">
          <Typography variant="h5">Pending vs Paid</Typography>
          <Box height="250px">
            {pieData.some(d => d.value > 0) ? (
              <PieChart isDashboard={true} data={pieData} />
            ) : (
              <Typography>No payout data available</Typography>
            )}
          </Box>
        </Box>

        <Box mt="40px" backgroundColor="#1f2a40" p="20px">
          <Typography variant="h5">Commission vs Net Earnings</Typography>
          <Box height="250px">
            {commissionData.some(d => d.value > 0) ? (
              <PieChart isDashboard={true} data={commissionData} />
            ) : (
              <Typography>No commission data available</Typography>
            )}
          </Box>
        </Box>

        <Box mt="40px" backgroundColor="#1f2a40" p="20px">
          <Typography variant="h5">Weekly Net Payouts</Typography>
          <Box height="250px">
            {lineData[0].data.length > 0 ? (
              <LineChart isDashboard={true} data={lineData} />
            ) : (
              <Typography>No weekly data available</Typography>
            )}
          </Box>
        </Box>


      {/*  Payout history table */}
      <Box mt="40px">
        <Typography variant="h5">Payout History</Typography>
        <DataGrid
          loading={loading}
          rows={payouts}
          columns={columns}
          getRowId={(row) => row.driver_id + row.week}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          autoHeight
        />
      </Box>


      {/*  Global Snackbar */}
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

export default FinanceDashboard;