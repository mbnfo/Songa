            //mui icons
import { Snackbar, Alert, Box, Paper,Button,Dialog,
         DialogTitle, DialogContent, TextField, FormControl, 
          InputLabel, Select, MenuItem, IconButton, Menu, useTheme } from "@mui/material";
import { DataGrid, GridToolbar  } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // three-dot icon
           //react icons
import { useState, useEffect } from "react";
          //axios
import axios from "axios";
         //other files
import Header from "../../components/Header";
import { tokens } from "../../theme";


const API_URL =
  process.env.REACT_APP_API_URL || "https://biasedly-abjective-brenden.ngrok-free.dev";

// ✅ Separate component for row actions dropdown
const ActionsMenu = ({ row, onStatusChange, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  





  return (
    <Box>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            onStatusChange(row.id, "Active");
            handleClose();
          }}
        >
          Set Active
        </MenuItem>
        <MenuItem
          onClick={() => {
            onStatusChange(row.id, "Inactive");
            handleClose();
          }}
        >
          Set Inactive
        </MenuItem>
        <MenuItem
          onClick={() => {
            onStatusChange(row.id, "Suspended");
            handleClose();
          }}
        >
          Suspend
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete(row.id);
            handleClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

const ManageUsers = () => {
  
  const [roleToCreate, setRoleToCreate] = useState(null);
  const [rows, setRows] = useState([]);        // your user data
  const [searchText, setSearchText] = useState(""); // ✅ search bar state
 


  // ✅ Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    cellNumber: "",
    email: "",
    address: "",
    id_passport: "",
    vehicle_id: "",
  });

  // ✅ Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Status filter
  const [statusFilter, setStatusFilter] = useState("");
  const role = localStorage.getItem("role");


// ✅ Fetch users with JWT
useEffect(() => {
  const token = localStorage.getItem("token"); // get token from localStorage

  fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ send token in header
    },
  })
    .then((res) => res.json())
    .then((data) => {
      // Defensive check: only set rows if data is an array
      if (Array.isArray(data)) {
        setRows(data);
      } else {
        console.error("Unexpected response:", data);
        setRows([]);
      }
    })
    .catch((err) => console.error("Error fetching users:", err));
}, []);


  // Update status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put( `${API_URL}/owner/users/${id}/status`, { status: newStatus },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }

      );
    
      setRows(rows.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
      setSnackbar({ open: true, message: `Status updated to ${newStatus}`, severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to update status", severity: "error" });
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`,{
                  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                } );
      setRows(rows.filter((u) => u.id !== id));
      setSnackbar({ open: true, message: "User deleted successfully", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to delete user", severity: "error" });
    }
  };

  // Create user
  const handleCreateUser = async () => {
    try {
      const payload = { ...formData, role: roleToCreate, driverId: roleToCreate === "driver" ? formData.vehicle_id : null };
      await axios.post(`${API_URL}/register`, payload);

      setRoleToCreate(null);
      setFormData({ username: "", password: "", firstName: "", lastName: "", cellNumber: "", email: "", address: "", id_passport: "", vehicle_id: "" });

      const updated = await fetch(`${API_URL}/users`, {
                  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }).then((r) => r.json());

      setRows(updated);

      setSnackbar({ open: true, message: "User created successfully!", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to create user", severity: "error" });
    }
  };

  // ✅ Columns with dropdown actions
  const columns = [
    { field: "id", headerName: "ID", width: 40, sortable: true },
    { field: "username", headerName: "Username", flex: 1, sortable: true },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      sortable: true,
      headerClassName: "role-header",
      headerAlign: "center",
      align: "center",
    },
    { field: "first_name", headerName: "First Name", flex: 1, sortable: true },
    { field: "last_name", headerName: "Last Name", flex: 1, sortable: true },
    { field: "cell_number", headerName: "Cell Number", flex: 1, sortable: true },
    { field: "email", headerName: "Email", flex: 1, sortable: true },
    { field: "address", headerName: "Address", flex: 1, sortable: true },
    { field: "id_passport", headerName: "ID/Passport", flex: 1, sortable: true },
    { field: "status", headerName: "Status", flex: 1, sortable: true },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <ActionsMenu
          row={params.row}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      ),
    },
  ];

   // Apply status filter and search filter
const filteredRows = rows.filter((row) => {
  const matchesStatus = statusFilter ? row.status === statusFilter : true;
  const matchesSearch = searchText
    ? Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    : true;
  return matchesStatus && matchesSearch;
});


  return (
    <Box m="20px">
      <Header title="MANAGE USERS" subtitle="Manage all system users" />

      {/* Buttons ABOVE the table */}
      <Box mb={2} display="flex" gap="10px">
        <Button variant="contained" color="secondary" onClick={() => setRoleToCreate("driver")}>Create Driver</Button>       
        <Button variant="contained" color="secondary" onClick={() => setRoleToCreate("finance")}>Create Finance</Button>
        <Button variant="contained" color="secondary" onClick={() => setRoleToCreate("support")}>Create Support</Button>
        <Button variant="contained" color="secondary" onClick={() => setRoleToCreate("admin")}>Create Admin</Button>
        <Button variant="contained" color="secondary" onClick={() => setRoleToCreate("owner")}>Create Owner</Button>
      </Box>

      {/* Status filter dropdown */}
      <FormControl variant="outlined" sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          label="Status"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
          <MenuItem value="Suspended">Suspended</MenuItem>
        </Select>
      </FormControl>

       {/* Search bar above the table */}
          <TextField
            label="Search Users"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ mb: 2, minWidth: 300, ml: 10 }}
          />

      {/* Table */}
      <Box height="70vh" overflow="scroll">

          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            getRowId={(row) => row.id}
            components={{ Toolbar: GridToolbar }}
            sx={{
              "& .MuiDataGrid-row": { minHeight: 78 }, // increase row height for better readability
              "& .MuiDataGrid-cell": { alignItems: "center" },
              "& .MuiDataGrid-columnHeader.role-header": {
                backgroundColor: colors.grey[800],
                color: colors.grey[100],
              },
              overflow: "scroll",
            }}
          />
      </Box>


        {/* ✅ Modal form */}
        {roleToCreate && (
          <Dialog open={true} onClose={() => setRoleToCreate(null)}>
            <DialogTitle>Create {roleToCreate}</DialogTitle>
            <DialogContent>
              <TextField label="Username" fullWidth sx={{ mb: 2 }}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <TextField label="Password" type="password" fullWidth sx={{ mb: 2 }}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <TextField label="First Name" fullWidth sx={{ mb: 2 }}
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <TextField label="Last Name" fullWidth sx={{ mb: 2 }}
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
              <TextField label="Cell Number" fullWidth sx={{ mb: 2 }}
                value={formData.cellNumber}
                onChange={(e) => setFormData({ ...formData, cellNumber: e.target.value })}
              />
              <TextField label="Email" fullWidth sx={{ mb: 2 }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField label="Address" fullWidth sx={{ mb: 2 }}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <TextField label="ID/Passport" fullWidth sx={{ mb: 2 }}
                value={formData.id_passport}
                onChange={(e) => setFormData({ ...formData, id_passport: e.target.value })}
              />
              {roleToCreate === "driver" && (
                <TextField label="Vehicle ID" fullWidth sx={{ mb: 2 }}
                  value={formData.vehicle_id}
                  onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                />
              )}
              <Button variant="contained" onClick={handleCreateUser}>Save</Button>
            </DialogContent>
          </Dialog>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
    </Box>
  );
};

export default ManageUsers;