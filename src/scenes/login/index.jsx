import { useState, useEffect } from "react";
import {Box,Button,TextField,Typography,Select, MenuItem,Alert,Fade,} from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// ✅ Import your logo
import logo from "../../assets/New_Songa_Logo.png";



const LoginPage = () => {
  // ✅ Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cellNumber, setCellNumber] = useState("");
  const [email, setEmail] = useState("");  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("driver");
  const [driverId, setDriverId] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  // Alert state
  const [showSessionExpired, setShowSessionExpired, showLoggedOut, setShowLoggedOut] = useState(false);
  

  const navigate = useNavigate();
  const location = useLocation();

  //  Clear token on startup and check if redirected with sessionExpired flag
  useEffect(() => {
    localStorage.removeItem("token"); // always start clean
    if (location.state?.sessionExpired) {    
      setShowSessionExpired(true); // show alert if redirected   
      navigate("/", { replace: true, state: {} });//  Clear state so it doesn’t repeat
    }
     if (location.state?.loggedOut) {
    setShowSessionExpired(false); // hide expired alert if showing
    setShowLoggedOut(true);       // new state for logout alert
    navigate("/", { replace: true, state: {} });
  }
 }, [location.state]);


  // ✅ Login handler
  const handleLogin = async () => {
  const API_URL = process.env.REACT_APP_API_URL || "https://biasedly-abjective-brenden.ngrok-free.dev";
  try {
    const res = await axios.post(`${API_URL}/login`, { username, password });
    console.log("Login response:", res.data);
    const { token } = res.data;

    if (!token) {
      alert("Login failed: no token received");
      return;
    }

    // Save token
    localStorage.setItem("token", token);

      // Decode role and username from JWT
      const decoded = jwtDecode(token);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("username", decoded.username || username);


    // Save role in localStorage
    if (decoded.role) {
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("username", decoded.username || username);
    }

    // Redirect based on role
    if (decoded.role === "owner") {
      navigate("/owner");
    } else if (decoded.role === "admin") {
      navigate("/admin");
    } else if (decoded.role === "driver") {
      navigate("/driver");
    } else if (decoded.role === "finance") {
      navigate("/finance");
    } else if (decoded.role === "support") {
      navigate("/support");
    } else if (decoded.role === "owner") {
      console.log("User is owner, navigating to /admin");
      navigate("/admin");
    } else if (decoded.role === "user") {
      console.log("User is user, navigating to /dashboard");
      navigate("/dashboard");
    } else {
      alert("Login failed: unknown role in token");
    }

  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    alert("Login failed");
  }
};
    {/*
    Register handler
  const handleRegister = async () => {
      const API_URL = process.env.REACT_APP_API_URL || "https://biasedly-abjective-brenden.ngrok-free.dev";

    try {
      await axios.post(`${API_URL}/register`, 
        {
        username,
        password,
        role,
        driverId: role === "driver" ? driverId : null,
        firstName,
        lastName,
        cellNumber,
        email,
      });
      alert("Registration successful! You can now log in.");
      setIsRegister(false);
    } catch {
      alert("Registration failed");
    }
  };
*/}
  return (
    <Box display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center"
        height="100vh">

           {/*  Style block for logo animations */}
        <style>
              {`
                @keyframes bounceFade {
                  0% {
                    opacity: 0;
                    transform: scale(0.8) translateY(-20px);
                  }
                  50% {
                    opacity: 1;
                    transform: scale(1.05) translateY(0);
                  }
                  100% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                  }
                }

                @keyframes pulse {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.03); }
                  100% { transform: scale(1); }
                }

                .logo-animated {
                  animation: bounceFade 1.2s ease forwards, pulse 3s ease-in-out infinite;
                }
              `}
            </style>


          {/*  Responsive Logo
          
          
          */}
     <Box display="flex" justifyContent="center" mb={2}>
        <Fade in={true} timeout={1200}>
            <img
              src={logo}
              alt="Songa Logo"
              className="logo-animated"
              style={{ width: "380px", height: "250", marginBottom: "10px" }}
              sx={{
                width: {
                  xs: "80px",   // small screens (mobile)
                  sm: "100px",  // tablets
                  md: "120px",  // desktops
                  lg: "150px",  // large desktops
                },
                height: "auto", // keep aspect ratio
              }}
            />
         </Fade>
      </Box>


          {/*FLEET MANAGEMENT TEXT 

          <Typography 
              variant="h4" 
              color="#e0e0e0"
              sx={{ mb: 1 , lineHeight: 1 }} // Adjust text height, move it further up
          >
              Songa
        </Typography>

        <Typography 
              variant="h4" 
              mb={1} 
              color="#e0e0e0"
              sx={{ lineHeight: 2 }} // Adjust text height, move it further up         
        >
               Fleet Management {isRegister ? "Register" : "Login"}
        </Typography>
   */}

      {/* ✅ Fade-in + Fade-out + Dismissible session expired alert */}
      <Fade in={showSessionExpired} timeout={{ enter: 600, exit: 600 }}>
        <Box>
          {showSessionExpired && (
            <Alert
              severity="error"
              sx={{ mb: 2, width: "300px" }}
              onClose={() => setShowSessionExpired(false)} // close button triggers fade-out
            >
              Session expired. Please log in again.
            </Alert>
          )}
        </Box>
      </Fade>
   
       <Fade in={showLoggedOut} timeout={{ enter: 600, exit: 600 }}>
            <Box>
              {showLoggedOut && (
                <Alert
                  severity="success"
                  sx={{ mb: 2, width: "300px" }}
                  onClose={() => setShowLoggedOut(false)}
                >
                  You have been logged out successfully.
                </Alert>
              )}
            </Box>
       </Fade>




      {/*  Login/Register form */}
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} sx={{ mb: 2, width: "300px" }} />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2, width: "300px" }} />

      {isRegister && (
        <>
          <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} sx={{ mb: 2, width: "300px" }} />
          <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} sx={{ mb: 2, width: "300px" }} />
          <TextField label="Cell Number" value={cellNumber} onChange={(e) => setCellNumber(e.target.value)} sx={{ mb: 2, width: "300px" }} />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2, width: "300px" }} />

          <Select value={role} onChange={(e) => setRole(e.target.value)} sx={{ mb: 2, width: "300px" }}>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="driver">Driver</MenuItem>
          </Select>

          {role === "driver" && (
            <TextField label="Driver ID" value={driverId} onChange={(e) => setDriverId(e.target.value)} sx={{ mb: 2, width: "300px" }} />
          )}
        </>
      )}
        
                     {/*ACTUAL LOGIN BUTTON */}
          <Button
                variant="contained"
                color="primary"
                onClick={ handleLogin}
                sx={{
                  border: "2px solid #fff", // white border
                  borderRadius: "8px",      // Rounded corners
                }}
              >
                {isRegister ? "Register" : "Login"}
        </Button>

    {/* REGISTER BUTTON 
      <Button sx={{ mt: 2 }} onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Already have an account? Login" : "Create an account"}
      </Button>
    */}
    </Box>
  );
};

export default LoginPage;