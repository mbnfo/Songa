import { Box, IconButton, useTheme, Typography } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import useLogout from "./LogoutButton";

// ✅ Import your logo
import logo from "../../assets/songa_logo.png";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const handleLogout = useLogout();

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
      {/* ✅ Logo + Animated Text */}
      <Box display="flex" alignItems="center" gap={1}>
        <style>
          {`
            @keyframes fadeSlide {
              0% { opacity: 0; transform: translateX(-20px); }
              50% { opacity: 1; transform: translateX(5px); }
              100% { opacity: 1; transform: translateX(0); }
            }
            .brand-text {
              animation: fadeSlide 1.2s ease forwards;
            }
          `}
        </style>
        <Box
          component="img"
          src={logo}
          alt="Songa Logo"
          sx={{ width: 40, height: "auto" }}
        />
        <Typography
          variant="h6"
          className="brand-text"
          sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}
        >
          SONGA FLEET MANAGEMENT
        </Typography>
      </Box>

      {/* ✅ SEARCH BAR 
      <Box display="flex" backgroundColor={colors.primary[600]} borderRadius="3px">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>
      */}

      {/* ✅ ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleLogout}>
          <ExitToAppIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;