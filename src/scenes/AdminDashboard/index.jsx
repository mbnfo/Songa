import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import PieChart from "../../components/PieChart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CsvUpload from "../../components/CsvUpload"; 
//Backend fetch:
import { useEffect } from "react";
import axios from "axios";
//CSV Imports
import Papa from "papaparse";
import { useState } from "react";
//Colours for Bar graph and Pie chart
import { getDriverColor } from "../../utils/colorUtils";
import { useNavigate } from "react-router-dom";


const Dashboard = () => { 
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
   const navigate = useNavigate();
/*
   //Hard auth check
   useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/", { replace: true });
  }
}, [navigate]);

*/

   // ✅ Logout handler
 /* const handleLogout = () => {
    console.log("Logout clicked");
    localStorage.removeItem("token"); // clear JWT
    navigate("/", { replace: true }); // redirect to login page
  };
*/

  // State for backend data
  const [dbData, setDbData] = useState([]);
    const fetchData = async () => {
      try {    
        const res = await axios.get("http://localhost:3001/dashboard-data");
        setDbData(res.data);
        console.log("Fetched DB data:", res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };
     useEffect(() => {
    fetchData();
  }, []);



    useEffect(() => {
      if (dbData.length > 0) {
        console.log("Sample row from backend:", dbData[0]);
      }
    }, [dbData]);
//--------------------------------------------------------

//Displa CSV name
const [selectedFileName, setSelectedFileName] = useState("");
const [uploaded, setUploaded] = useState(false);


  // CSV Upload (optional local parsing)
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  setSelectedFileName(file.name);   // ✅ show file name
  setUploaded(true);                // ✅ hide upload button after upload
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: (results) => {
      setDbData(results.data);
      console.log("Parsed CSV:", results.data);
    },
  });
};


// Compute stats from CSV

//TOTAL GROSS
const totalGross = dbData.length
  ? dbData.reduce((sum, row) => sum + Number(row.gross || 0), 0)
  : 0;

  //TOTAL NET EARNINGS
 const totalNet = dbData.reduce((sum, row) => 
  sum + Number(row.net || 0), 0);

 //TOTAL DRIVERS
const totalDrivers = dbData.length
  ? new Set(dbData.map((row) => row.driver_id)).size
  : 0;

const pendingPayouts = dbData.length
  ? dbData.filter((row) => row.payout_status === "Pending").length
  : 0;

// Normalize driver IDs/names
const normalizeDriver = (row) =>
  (row.driver_id || row.DriverID || row.driverName || "")
    .toString()
    .trim()
    .toUpperCase();

    // Aggregate gross earnings per driver for bar chart
const driverGrossTotals = dbData.reduce((acc, row) => {
  const id = normalizeDriver(row);
  if (!id) return acc;
  if (!acc[id]) acc[id] = 0;
  acc[id] += Number(row.gross || row.GrossEarnings || 0);
  return acc;
}, {});

// Aggregate gross/net earnings per week
const weeklyTotals = dbData.reduce((acc, row) => {
  const week = row.week || row.Week; // normalize
  if (!week) return acc;
  if (!acc[week]) acc[week] = { gross: 0, net: 0 };
  acc[week].gross += Number(row.gross || row.GrossEarnings || 0);
  acc[week].net += Number(row.net || row.NetEarnings || 0);
  return acc;
}, {});




// Bar chart data: one entry per driver
const barData = Object.entries(driverGrossTotals).map(([driverId, totalGross]) => ({
  driver: driverId,
  sales: totalGross,
}));


// Aggregate net earnings per driver for pie chart
const driverNetTotals = dbData.reduce((acc, row) => {
  const id = normalizeDriver(row);
  if (!id) return acc;
  if (!acc[id]) acc[id] = 0;
  acc[id] += Number(row.net || row.NetEarnings || 0);
  return acc;
}, {});

 
// ✅ Convert to chart format
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

//REVENUE GENERATED
const revenueGenerated = Object.values(weeklyTotals).reduce(
  (sum, values) => sum + values.net, 0
);

//PIE CHART

// Aggregate net earnings per driver
const driverTotals = dbData.reduce((acc, row) => {
  const id = row.driver_id || row.driverId; // handle both snake_case and camelCase
  if (!id) return acc;
  if (!acc[id]) acc[id] = 0;
  acc[id] += Number(row.net || 0);
  return acc;
}, {});

// Convert to pie chart format
const pieData = Object.entries(driverTotals).map(([driverId, totalNet]) => ({
  id: driverId,
  label: driverId,   // ✅ no "Driver " prefix
  value: totalNet,
}));


  return (
    
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        
        

         



        <Box display="flex" gap="10px">
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
          <Box display="flex" gap="10px">
           {/* CSV Upload */}

    <CsvUpload onUploadSuccess={fetchData} />
        </Box>
      </Box>
      </Box>

      

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
           {/*  //GROSS EARNINGS  */}
          <StatBox
            title={`$${totalGross.toFixed(2)}`}
            subtitle="Total Gross Earnings (Before deductions)"
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
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
           {/*  //TOTAL NET EARNINGS  */}
          <StatBox
            title={`$${totalNet.toFixed(2)}`}
            subtitle="Total Net Earnings (After deductions)"
            progress="0.50"
            increase="+21%"
            icon={
              <AccountBalanceWalletIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {/*  //TOTAL DRIVERS  */}
          <StatBox
            title={totalDrivers}
            subtitle="Active Drivers"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>


        {/* ROW 2 */}
        
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                <Typography 
                variant="h3" 
                fontWeight="bold" 
                color={colors.greenAccent[500]}>
                ${revenueGenerated.toFixed(2)}
                </Typography>
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} data={lineData} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >

            {/* RECENT TRANSACTIONS */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>

            {/* RECENT TRANSACTIONS FETCH FROM DB TO FRONT END */}
          {dbData.slice(-5).map((row, i) => (
            <Box
              key={`${row.driver_id || row.DriverID}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >

              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >

                  {row.driver_id || row.DriverID}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {row.week || row.Week}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>
                Gross: ${Number(row.gross || row.GrossEarnings).toFixed(2)}
                </Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                Net: ${(Number(row.gross || row.GrossEarnings) * 0.8).toFixed(2)}
              </Box>
            </Box>
          ))}
        </Box>




        {/* ROW 3 */}

        {/*PIE CHART */}
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >         
          
         <PieChart
              isDashboard={true}
              data={pieData}
              colors={({ id }) => getDriverColor(id)} // driver ID or name
            />


          <Typography 
          variant="h5" 
          fontWeight="600"
            sx={{ marginBottom: "15px" }}
            >

            Driver Perfomance
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >     
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >             
            </Typography>
          </Box>
        </Box>
      


          {/*BAR GRAPH*/}
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            
            <BarChart
              isDashboard={true}
              data={barData}
              colors={({ indexValue }) => getDriverColor(indexValue)} // driver ID or name
            />


          </Box>
        </Box>

      </Box>
    </Box>
  )
}  

export default Dashboard;


