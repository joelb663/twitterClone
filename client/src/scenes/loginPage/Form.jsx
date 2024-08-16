import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";

// Validation schema for the registration form using Yup
const registerSchema = yup.object().shape({
  name: yup.string().required("required"),
  gender: yup.string().required("required"),
  birthDate: yup.string().required("required"),
  username: yup.string().required("required"),
  password: yup.string().required("required"),
});

// Validation schema for the login form using Yup
const loginSchema = yup.object().shape({
  username: yup.string().required("required"),
  password: yup.string().required("required"),
});

// Initial values for the registration form
const initialValuesRegister = {
  name: "",
  gender: "",
  birthDate: "",
  username: "",
  password: "",
};

// Initial values for the login form
const initialValuesLogin = {
  username: "",
  password: "",
};

// Main Form component
const Form = () => {
  const [pageType, setPageType] = useState("login"); // State to toggle between login and registration forms
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = pageType === "login"; // Boolean to check if the current page is the login form
  const isRegister = pageType === "register"; // Boolean to check if the current page is the registration form

  // Function to handle user registration
  const register = async (values, onSubmitProps) => {
    const savedUserResponse = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm(); // Reset form fields after submission

    if (savedUser) {
      setPageType("login"); // Switch to the login form after successful registration
    }
  };

  // Function to handle user login
  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm(); // Reset form fields after submission
    
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.userAccount, // Store user data in the Redux store
          token: loggedIn.token // Store authentication token in the Redux store
        })
      );
      navigate("/home"); // Redirect user to the homepage after successful login
    }
  };

  // Function to handle form submission, determines whether to call login or register
  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps); // Call login function if on login page
    if (isRegister) await register(values, onSubmitProps); // Call register function if on registration page
  };

  return (
    <Formik
      onSubmit={handleFormSubmit} // Function to call on form submission
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister} // Set initial values based on form type
      validationSchema={isLogin ? loginSchema : registerSchema} // Set validation schema based on form type
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          >
            {isRegister && ( // Show these fields only if the user is on the registration page
              <>
                <TextField
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={Boolean(touched.name) && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 4" }}
                />

                <input onChange={handleChange} type="radio" id="male" name="gender" value="male"/> Male
                <input onChange={handleChange} type="radio" id="female" name="gender" value="female"/> Female
        
                <TextField
                  label="BirthDate"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.birthDate}
                  name="birthDate"
                  error={Boolean(touched.birthDate) && Boolean(errors.birthDate)}
                  helperText={touched.birthDate && errors.birthDate}
                  sx={{ gridColumn: "span 4" }}
                  placeholder="yyyy-mm-dd"
                />
              </>
            )}

            <TextField
              label="Username"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.username}
              name="username"
              error={Boolean(touched.username) && Boolean(errors.username)}
              helperText={touched.username && errors.username}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"} {/* Button text changes based on page type */}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login"); // Toggle between login and registration forms
                resetForm(); // Reset form fields when switching forms
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."} {/* Link text changes based on page type */}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;