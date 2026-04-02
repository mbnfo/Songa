import { Box, IconButton, useTheme, Typography } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import useLogout from "./LogoutButton";

// ✅ Import your logo
import logo from "../../assets/New_Songa_Logo.png";

// ✅ Messages to cycle through
const messages = [
  "SONGA FLEET MANAGEMENT",
  "DRIVING EFFICIENCY",
  "EMPOWERING DRIVERS",
  "DELIVERING RESULTS",
];

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const handleLogout = useLogout();

  // Track which message is showing
  const [currentMessage, setCurrentMessage] = useState(0);

  // Cycle through messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      sx={{
        background: `linear-gradient(90deg, ${colors.primary[700]}, ${colors.greenAccent[700]})`,
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      }}
    >
      {/* ✅ Left side: icons */}
      <Box display="flex" gap={1}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
        <IconButton><NotificationsOutlinedIcon /></IconButton>
        <IconButton><SettingsOutlinedIcon /></IconButton>
        <IconButton><PersonOutlinedIcon /></IconButton>
        <IconButton onClick={handleLogout}><ExitToAppIcon /></IconButton>
      </Box>

      {/* ✅ Center: animated messages */}
      <Box
        sx={{
          flex: 1,
          textAlign: "center",
          mx: 2,
        }}/>
      {/* ✅ Left side: icons */}
      <Box display="flex" gap={1}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
        <IconButton><NotificationsOutlinedIcon /></IconButton>
        <IconButton><SettingsOutlinedIcon /></IconButton>
        <IconButton><PersonOutlinedIcon /></IconButton>
        <IconButton onClick={handleLogout}><ExitToAppIcon /></IconButton>
      </Box>

      {/* ✅ Center: scrolling ticker */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        <style>
          {`
            @keyframes slideFade {
              0%   { transform: translateX(100%); opacity: 0; }
              20%  { transform: translateX(0); opacity: 1; }
              80%  { transform: translateX(0); opacity: 1; }
              100% { transform: translateX(-100%); opacity: 0; }
            }
            .slide-message {
              display: inline-block;
              animation: slideFade 5s ease-in-out forwards;
            }
          `}
        </style>

        <Typography
          variant="h6"
          className="slide-message"
          sx={{
            fontWeight: "bold",
            color: colors.greenAccent[500],
          }}
          key={currentMessage} // forces re-render when message changes
        >
          {messages[currentMessage]}
        </Typography>
      </Box>

      {/* ✅ Right side: logo */}
      <Box
        component="img"
        src={logo}
        alt="Songa Logo"
        sx={{ width: 100, height: "auto" }}
      />
    </Box>
  );
};

export default Topbar;
