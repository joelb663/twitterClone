import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";

const EditProfilePage = () => {
    // State to hold the user data fetched from the API
    const [user, setUser] = useState(null);

    // Get userId from the route parameters
    const { userId } = useParams();

    // Access theme colors from MUI's theme
    const { palette } = useTheme();

    // Get the token from the Redux store
    const token = useSelector((state) => state.token);

    const navigate = useNavigate();

    // Function to fetch user data based on userId
    const getUser = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data); // Update the state with the fetched user data
    };

    // Fetch user data when the component mounts
    useEffect(() => {
        getUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // If user data hasn't been fetched yet, return null to avoid rendering the form
    if (!user) return null;

    // Destructure user details from the user state
    const {
        name,
        gender,
        birthDate,
        bio,
        createdAt,
        profilePicturePath,
        location,
    } = user;

    // Validation schema for the form using Yup
    const profileSchema = yup.object().shape({
        name: yup.string().required("required"),
        gender: yup.string().required("required"),
        birthDate: yup.string(),
        bio: yup.string(),
        profilePicturePath: yup.string(),
        location: yup.string(),
    });

    // Initial values for the form fields
    const initialValuesProfile = {
        name: name,
        gender: gender,
        birthDate: birthDate,
        bio: bio,
        profilePicturePath: profilePicturePath,
        location: location,
    };

    // Function to handle form submission and update the user profile
    const updateUserProfile = async (values, onSubmitProps) => {
        const data = {
            name: values.name,
            gender: values.gender,
            birthDate: values.birthDate,
            bio: values.bio,
            profilePicturePath: values.profilePicturePath,
            location: values.location,
        };

        // If a new picture is uploaded, update the profile picture path
        if (values.picture) {
            data.profilePicturePath = values.picture.name;
        }

        // Send a PATCH request to update the user profile
        const savedUserResponse = await fetch(`http://localhost:3001/users/${userId}/updateUser`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm(); // Reset the form after submission

        // If the update was successful, navigate to the home page
        if (savedUser) {
            navigate("/home");
        }
    };

    // Function to handle form submission
    const handleFormSubmit = async (values, onSubmitProps) => {
        await updateUserProfile(values, onSubmitProps);
    };

    return (
        // Formik component to handle form state, validation, and submission
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValuesProfile}
            validationSchema={profileSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
            }) => (
                <Box>
                    <Navbar />
                    <Box
                        width="100%"
                        padding="2rem 6%"
                        display="block"
                        gap="0.5rem"
                        justifyContent="space-between"
                    >
                        <form onSubmit={handleSubmit}>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: "span 4" },
                                }}
                            >
                                {/* Name field */}
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

                                {/* Profile Picture Upload */}
                                <Box
                                    gridColumn="span 4"
                                    border={`1px solid ${palette.neutral.medium}`}
                                    borderRadius="5px"
                                    p="1rem"
                                >
                                    <Box gridColumn="span 4">
                                        <Typography variant="body1" mb="0.5rem">
                                            Profile Picture
                                        </Typography>
                                        <Dropzone
                                            acceptedFiles=".jpg,.jpeg,.png"
                                            multiple={false}
                                            onDrop={(acceptedFiles) =>
                                                setFieldValue("picture", acceptedFiles[0])
                                            }
                                        >
                                            {({ getRootProps, getInputProps }) => (
                                                <Box
                                                    {...getRootProps()}
                                                    border={`2px dashed ${palette.primary.main}`}
                                                    p="1rem"
                                                    sx={{ "&:hover": { cursor: "pointer" } }}
                                                >
                                                    <input {...getInputProps()} />
                                                    {!values.picture ? (
                                                        <p>Add Picture Here</p>
                                                    ) : (
                                                        <FlexBetween>
                                                            <Typography>{values.picture.name}</Typography>
                                                            <EditOutlinedIcon />
                                                        </FlexBetween>
                                                    )}
                                                </Box>
                                            )}
                                        </Dropzone>
                                    </Box>
                                </Box>

                                {/* Gender selection radio buttons */}
                                <input
                                    onChange={handleChange}
                                    type="radio"
                                    id="male"
                                    name="gender"
                                    value="male"
                                    checked={values.gender === "male"}
                                /> Male
                                <input
                                    onChange={handleChange}
                                    type="radio"
                                    id="female"
                                    name="gender"
                                    value="female"
                                    checked={values.gender === "female"}
                                /> Female

                                {/* Birthdate field */}
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

                                {/* Bio field */}
                                <TextField
                                    label="Bio"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.bio}
                                    name="bio"
                                    error={Boolean(touched.bio) && Boolean(errors.bio)}
                                    helperText={touched.bio && errors.bio}
                                    sx={{ gridColumn: "span 4" }}
                                />

                                {/* Location field */}
                                <TextField
                                    label="Location"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.location}
                                    name="location"
                                    error={Boolean(touched.location) && Boolean(errors.location)}
                                    helperText={touched.location && errors.location}
                                    sx={{ gridColumn: "span 4" }}
                                />

                                {/* Display when the user joined */}
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography
                                        variant="h4"
                                        fontWeight="500"
                                    >
                                        Joined {createdAt.substring(0, 10)}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Submit button */}
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
                                Update Info
                            </Button>
                        </form>
                    </Box>
                </Box>
            )}
        </Formik>
    );
};

export default EditProfilePage;