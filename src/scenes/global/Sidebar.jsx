import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { tokens } from "../../theme";

// MUI Icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const Item = ({ title, to, icon, selected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  //const userRole = localStorage.getItem("role");

  return (
    <MenuItem
      active={selected === to}
      icon={icon}
      component={<Link to={to} />}
    >
      <Typography color={colors.grey[100]}>{title}</Typography>
    </MenuItem>
  );
};

const AppSidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  //  Get username from localStorage (saved at login)
  const username = localStorage.getItem("username");
  const userRole = localStorage.getItem("role"); 
  const firstName = localStorage.getItem("first_name"); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username"); // clear username on logout
    localStorage.removeItem("username"); // clear username on logout
    navigate("/", { replace: true });
  };

  return (
    <Sidebar
      collapsed={isCollapsed}
      rootStyles={{
        height: "100vh",
        ".ps-sidebar-container": {
          backgroundColor: colors.primary[700],
          height: "100%",
        },
        color: colors.grey[100],
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Menu
        menuItemStyles={{
          button: {
            "&:hover": { backgroundColor: "#868dfb", color: "#fff" },
            "&.active": { backgroundColor: "#6870fa", color: "#fff" },
          },
        }}
      >
        {/* Collapse toggle */}
        <MenuItem
          onClick={() => setIsCollapsed(!isCollapsed)}
          icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
        >
          {!isCollapsed && (
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h3">{firstName}</Typography>
              <Typography variant="h3">{firstName}</Typography>
              <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                <MenuOutlinedIcon />
              </IconButton>
            </Box>
          )}
        </MenuItem>

        {/* Profile */}
        {!isCollapsed && (
          <Box mb="25px" textAlign="center">
            <img
              alt="profile-user"
              width="100px"
              height="100px"
              src={`../../assets/user.png`}
              style={{ cursor: "pointer", borderRadius: "50%" }}
            />
            <Typography variant="h2" fontWeight="bold" sx={{ mt: "10px" }}>
              {username} {/* dynamic username */}
              {username} {/* dynamic username */}
            </Typography>


            <Typography variant="h5" color={colors.greenAccent[500]}>
              {userRole}
            </Typography>
          </Box>
        )}

        {/* Navigation */}

        {/* Navigation */}
          <Item
            title="Dashboard"
            to={`/${userRole}`} //  dynamic role-based dashboard
            icon={<HomeOutlinedIcon />}
            selected={location.pathname}
          />

          {/*  Show Manage Users only for owners */}
            {userRole === "owner" && (
              <Item
                title="Manage Users"
                to="/owner/manage-users"
                icon={<PeopleOutlinedIcon />}
                selected={location.pathname}
              />
            )}
    

        {/* Show Support Dashboard only if role === 'support' */}
        {userRole === "support" && (
          <Item
            title="Support Dashboard"
            to="/support-dashboard"
            icon={<HelpOutlineIcon />}
            selected={location.pathname}
          />
        )}

        {/*  Show Finance Dashboard only if role is finance or owner*/}
        {(userRole === "finance" || userRole === "owner") && (
            <Item
              title="Finance Dashboard"
              to="/finance"
              icon={<AttachMoneyIcon />}
              selected={location.pathname}
            />
          )}
        {/*  Show Finance Dashboard only if role is finance or owner*/}
        {(userRole === "finance" || userRole === "owner") && (
            <Item
              title="Finance Dashboard"
              to="/finance"
              icon={<AttachMoneyIcon />}
              selected={location.pathname}
            />
          )}


        {/*  Show Audit Logs only if role === 'owner' */}
        {/*  Show Audit Logs only if role === 'owner' */}
        {userRole === "owner" && (
          <Item
            title="Audit Logs"
            to="/owner/audit-logs"
            icon={<ReceiptOutlinedIcon />}
            selected={location.pathname}
          />
        )}

        {/* Support: visible to all roles */}
            <Item
              title="Support"
              to="/support" // route to your SubmitIssueForm page
              icon={<HelpOutlineIcon />}
              selected={location.pathname}
            />

       


         {/* Logout at bottom */}
        <Box mt="auto">
          <MenuItem icon={<ExitToAppIcon />} onClick={handleLogout}>
            <Typography color={colors.grey[100]}>Logout</Typography>
          </MenuItem>
        </Box>


        
      </Menu>
    </Sidebar>
  );
};

export default AppSidebar;