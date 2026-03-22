import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";

  const API_URL = process.env.REACT_APP_API_URL || "https://biasedly-abjective-brenden.ngrok-free.dev"; 

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // Submit handler: posts form data to backend
  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post(`${API_URL}/register`, values);
      console.log("✅ User created:", response.data);
      alert("User created successfully!");
    } catch (error) {
      console.error("❌ Error creating user:", error);
      alert("Failed to create user");
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {/* First Name */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Last Name */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Username */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: "span 4" }}
              />
               {/* Password */}
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                error={!!touched.password && !!errors.password}
                helperText={
                  touched.password && errors.password
                    ? errors.password
                    : "Must contain uppercase, lowercase, number, and special character"
                }
                sx={{ gridColumn: "span 4" }}
              />

              {/* Email */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Contact Number */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Cell Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cell_number}
                name="cellNumber"
                error={!!touched.cell_number && !!errors.cell_number}
                helperText={touched.cell_number && errors.cell_number}
                sx={{ gridColumn: "span 4" }}
              />

              {/* ID/Passport Number */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="ID/Passport Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id_passport}
                name="id_passport"
                error={!!touched.id_passport && !!errors.id_passport}
                helperText={touched.id_passport && errors.id_passport}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Vehicle ID */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Vehicle ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.vehicle_id}
                name="vehicle_id"
                error={!!touched.vehicle_id && !!errors.vehicle_id}
                helperText={touched.vehicle_id && errors.vehicle_id}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Address */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Role dropdown */}
              <TextField
                select
                fullWidth
                variant="filled"
                label="Role"
                name="role"
                value={values.role}
                onChange={handleChange}
                error={!!touched.role && !!errors.role}
                helperText={touched.role && errors.role}
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="driver">Driver</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
            </Box>

            {/* Submit button */}
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// Phone validation 
const phoneRegExp = /^[0-9]{10,15}$/;



// Validation schema
const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  username: yup.string().required("required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*?&]/, "Must contain at least one special character")
    .required("required"),
  email: yup.string().email("invalid email").required("required"),
  cellNumber: yup.string().matches(phoneRegExp, "Phone number is not valid").required("required"),
  id_passport: yup.string().required("required"),
  address: yup.string().required("required"),
  role: yup.string().required("required"),
});

// Initial values
const initialValues = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  email: "",
  cellNumber: "",
  id_passport: "",
  address: "",
  role: "user",
};

export default Form;