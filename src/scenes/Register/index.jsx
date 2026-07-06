import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";

import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://biasedly-abjective-brenden.ngrok-free.dev";

const phoneRegExp = /^[0-9]{10,15}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*?&]/, "Must contain at least one special character")
    .required("Password is required"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  cellNumber: yup
    .string()
    .matches(phoneRegExp, "Invalid phone number")
    .required("Cell number is required"),
  id_passport: yup.string().required("ID / Passport is required"),
  vehicle_id: yup.string(),
  address: yup.string().required("Address is required"),
  role: yup.string().required("Role is required"),
  idDocument: yup
    .mixed()
    .required("Please upload your ID/Passport"),

driversLicense: yup
    .mixed()
    .required("Please upload your Driver's Licence"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  email: "",
  cellNumber: "",
  id_passport: "",
  vehicle_id: "",
  address: "",
  role: "user",

    idDocument: null,
  driversLicense: null,
};



const RegisterPage = () => {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      //const response = await axios.post(`${API_URL}/register`, values);

      const formData = new FormData();

            formData.append("firstName", values.firstName);
            formData.append("lastName", values.lastName);
            formData.append("username", values.username);
            formData.append("password", values.password);
            formData.append("email", values.email);
            formData.append("cellNumber", values.cellNumber);
            formData.append("id_passport", values.id_passport);
            formData.append("vehicle_id", values.vehicle_id);
            formData.append("address", values.address);
            formData.append("role", values.role);

             if (values.idDocument) {
                    formData.append("idDocument", values.idDocument);
                }

            if (values.driversLicense) {
                    formData.append("driversLicense", values.driversLicense);
                }

            const response = await axios.post(
                    `${API_URL}/register`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                console.log(response.data);
      

                alert("Registration successful!");

                resetForm();

                navigate("/");
                } catch (error) {
                console.error(error);

                alert(
                    error.response?.data?.message ||
                    "Registration failed. Please try again."
                );
                }
            };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      p={3}
    >
      <Box width="700px">
        <Typography variant="h3" mb={3} textAlign="center">
          Create Account
        </Typography>

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
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns="repeat(4, minmax(0,1fr))"
                sx={{
                  "& > div": {
                    gridColumn: isNonMobile ? undefined : "span 4",
                  },
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="First Name"
                  name="firstName"
                  value={values.firstName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.firstName && !!errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  label="Last Name"
                  name="lastName"
                  value={values.lastName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.lastName && !!errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  label="Username"
                  name="username"
                  value={values.username}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  label="Password"
                  type="password"
                  name="password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email"
                  name="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  label="Cell Number"
                  name="cellNumber"
                  value={values.cellNumber}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.cellNumber && !!errors.cellNumber}
                  helperText={touched.cellNumber && errors.cellNumber}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  label="ID / Passport Number"
                  name="id_passport"
                  value={values.id_passport}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.id_passport && !!errors.id_passport}
                  helperText={touched.id_passport && errors.id_passport}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  label="Vehicle ID"
                  name="vehicle_id"
                  value={values.vehicle_id}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  label="Address"
                  name="address"
                  value={values.address}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.address && !!errors.address}
                  helperText={touched.address && errors.address}
                  sx={{ gridColumn: "span 4" }}
                />
                  

                  {/*ID/Passport Document upload*/}
                <Typography sx={{ mt: 3, mb: 1, fontWeight: "bold", gridColumn: "span 4", }}>
                        Upload ID / Passport
                        </Typography>

                        <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                         sx={{
                                    gridColumn: "span 4",
                                    justifyContent: "flex-start",
                                }}
                            >
                            Choose File
                            <input
                                hidden
                                type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(event) =>
                            setFieldValue("idDocument", event.currentTarget.files[0])
                            }
                        />
                        </Button>

                        {values.idDocument && (
                        <Typography
                            variant="body2"
                            color="success.main"
                            sx={{ mt: 1 }}
                        >
                            ✅ {values.idDocument.name}
                        </Typography>
                        )}
                        {touched.idDocument && errors.idDocument && (
                            <Typography color="error" variant="body2">
                                {errors.idDocument}
                            </Typography>
                            )}



                 {/*License Document upload*/}
                 <Typography sx={{ mt: 3, mb: 1, fontWeight: "bold", gridColumn: "span 4", }}>
                            Upload Driver's Licence
                            </Typography>

                            <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                             sx={{
                                    gridColumn: "span 4",
                                    justifyContent: "flex-start",
                                }}
                            >
                            Choose File
                            <input
                                hidden
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(event) =>
                                setFieldValue("driversLicense", event.currentTarget.files[0])
                                }
                            />
                            </Button>

                            {values.driversLicense && (
                            <Typography
                                variant="body2"
                                color="success.main"
                                sx={{ mt: 1 }}
                            >
                                ✅ {values.driversLicense.name}
                            </Typography>
                            )}
                            {touched.driversLicense && errors.driversLicense && (
                            <Typography color="error" variant="body2">
                                {errors.driversLicense}
                            </Typography>
                            )}



                <TextField
                  select
                  fullWidth
                  variant="outlined"
                  label="Role"
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  sx={{ gridColumn: "span 4" }}
                >
                  
                  <MenuItem value="driver">Driver</MenuItem>
                  
                </TextField>
              </Box>

              <Box display="flex" justifyContent="space-between" mt={4}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/")}
                >
                  Back to Login
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Register
                </Button>

                <Button
                    variant="text"
                    onClick={() => navigate("/")}
                >
                    Already have an account? Login
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default RegisterPage;
