import { Box, IconButton, useTheme, Typography } from "@mui/material";
import { useContext } from "react";
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

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const handleLogout = useLogout();

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

      {/* ✅ Center: scrolling ticker */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          whiteSpace: "nowrap",
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
          whiteSpace: "nowrap",
          mx: 2,
        }}
      >
        <style>
          {`
            @keyframes ticker {
            @keyframes ticker {
              0%   { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .ticker-text {
            .ticker-text {
              display: inline-block;
              padding-right: 50px; /* spacing between repeats */
              animation: ticker 20s linear infinite;
              padding-right: 50px; /* spacing between repeats */
              animation: ticker 20s linear infinite;
            }
            .ticker-text:hover {
            .ticker-text:hover {
              animation-play-state: paused;
            }
          `}
        </style>

        <Box className="ticker-text">
          <Typography variant="h6" sx={{ fontWeight: "bold", color: colors.greenAccent[500], display: "inline", mr: 4 }}>
            SONGA FLEET MANAGEMENT
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: colors.greenAccent[500], display: "inline", mr: 4 }}>
            SONGA FLEET MANAGEMENT
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: colors.greenAccent[500], display: "inline", mr: 4 }}>
            SONGA FLEET MANAGEMENT
          </Typography>
        </Box>
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