import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const Bottombar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/", { replace: true });
  };

  const navItems = [
    {
      title: "Home",
      to: `/${userRole}`,
      icon: <HomeOutlinedIcon fontSize="small" />,
      roles: ["owner", "finance", "support"],
    },
    {
      title: "Users",
      to: "/owner/manage-users",
      icon: <PeopleOutlinedIcon fontSize="small" />,
      roles: ["owner"],
    },
    {
      title: "Finance",
      to: "/finance",
      icon: <AttachMoneyIcon fontSize="small" />,
      roles: ["owner", "finance"],
    },
    {
      title: "Logs",
      to: "/owner/audit-logs",
      icon: <ReceiptOutlinedIcon fontSize="small" />,
      roles: ["owner"],
    },
    {
      title: "Support",
      to: "/support/issues",
      icon: <HelpOutlineIcon fontSize="small" />,
      roles: ["owner", "finance", "support"],
    },
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(userRole));

  const isActive = (to) => location.pathname === to;

  return (
    <Box
      sx={{
        display: { xs: "flex", md: "none" }, // only show on mobile
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "60px",
        backgroundColor: colors.primary[700],
        borderTop: `1px solid ${colors.grey[800]}`,
        zIndex: 1300,
      }}
    >
      {visibleItems.map((item) => (
        <Box
          key={item.to}
          component={Link}
          to={item.to}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "3px",
            textDecoration: "none",
            color: isActive(item.to) ? "#6870fa" : colors.grey[400],
            transition: "color 0.15s",
            "&:hover": { color: "#868dfb" },
          }}
        >
          {item.icon}
          <Typography sx={{ fontSize: "10px", fontWeight: isActive(item.to) ? 600 : 400 }}>
            {item.title}
          </Typography>
        </Box>
      ))}

      {/* Logout */}
      <Box
        onClick={handleLogout}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "3px",
          cursor: "pointer",
          color: colors.grey[400],
          "&:hover": { color: "#868dfb" },
        }}
      >
        <ExitToAppIcon fontSize="small" />
        <Typography sx={{ fontSize: "10px" }}>Logout</Typography>
      </Box>
    </Box>
  );
};

export default Bottombar;