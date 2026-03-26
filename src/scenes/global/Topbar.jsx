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
      {/* ✅ Logo + Scrolling Text */}
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        sx={{ overflow: "hidden", whiteSpace: "nowrap", cursor: "pointer" }}
        onClick={() => (window.location.href = "/")} // click to go home
      >
        <style>
          {`
            @keyframes scrollText {
              0%   { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .scrolling-text {
              display: inline-block;
              animation: scrollText 12s linear infinite;
            }
            .scrolling-text:hover {
              animation-play-state: paused;
            }
          `}
        </style>

        {/* Responsive logo */}
        <Box
          component="img"
          src={logo}
          alt="Songa Logo"
          sx={{
            width: { xs: 50, sm: 60, md: 70 },
            height: "auto",
          }}
        />

        {/* Scrolling text */}
        <Typography
          variant="h6"
          className="scrolling-text"
          sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}
        >
          SONGA FLEET MANAGEMENT
        </Typography>
      </Box>

      {/* ✅ ICONS */}
      <Box display="flex" gap={1}>
        <IconButton
          onClick={colorMode.toggleColorMode}
          sx={{ "&:hover": { transform: "scale(1.1)", color: colors.greenAccent[400] } }}
        >
          {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
        <IconButton sx={{ "&:hover": { transform: "scale(1.1)", color: colors.greenAccent[400] } }}>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton sx={{ "&:hover": { transform: "scale(1.1)", color: colors.greenAccent[400] } }}>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton sx={{ "&:hover": { transform: "scale(1.1)", color: colors.greenAccent[400] } }}>
          <PersonOutlinedIcon />
        </IconButton>
        <IconButton
          onClick={handleLogout}
          sx={{ "&:hover": { transform: "scale(1.1)", color: colors.greenAccent[400] } }}
        >
          <ExitToAppIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;