import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import EditProfilePage from "scenes/editProfilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

function App() {
  // Access the current theme mode from Redux state
  const mode = useSelector((state) => state.mode);
  
  // Create a theme using the current mode
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  
  // Determine if the user is authenticated by checking if a token exists
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* Route for the login page */}
            <Route path="/" element={<LoginPage />} />

            {/* Route for the home page, accessible only if authenticated */}
            <Route 
              path="/home" 
              element={isAuth ? <HomePage /> : <Navigate to="/" />} 
            />
            
            {/* Route for the profile page, accessible only if authenticated */}
            <Route 
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />

            {/* Route for the edit profile page, accessible only if authenticated */}
            <Route 
              path="/editProfile/:userId"
              element={isAuth ? <EditProfilePage /> : <Navigate to="/" />}
            />

          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;