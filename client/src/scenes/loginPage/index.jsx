import { Box, Typography, useTheme } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
    const theme = useTheme();

    return (
        <Box>
          {/* Header */}
          <Box
            width="100%"
            backgroundColor={theme.palette.background.alt}
            p="1rem 6%"
            textAlign="center"
          >
            <Typography fontWeight="bold" fontSize="32px" color="primary">
                Twitter
            </Typography>
          </Box>
    
          {/* Main content area */}
          <Box
            width="50%"
            p="2rem"
            m="2rem auto"
            borderRadius="1.5rem"
            backgroundColor={theme.palette.background.alt}
          >
            <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
              Welcome to Twitter!
            </Typography>
            <Form />
          </Box>
        </Box>
      );
};

export default LoginPage;