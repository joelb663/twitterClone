import React, { useState, useEffect, useRef } from "react";
import {
  IconButton,
  InputBase,
  Typography,
  useTheme,
  Paper,
  MenuItem,
} from "@mui/material";
import { Search, DarkMode, LightMode } from "@mui/icons-material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";

const Navbar = () => {
  // Hooks for dispatch, navigation, and theme
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user.userId);

  // Extract theme and palette
  const theme = useTheme();
  const { palette } = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const main = palette.neutral.main;

  // State for search functionality and dropdown
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Refs for dropdown and debounce timeout
  const dropdownRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Function to fetch users based on search query
  const getUsersBySearch = async (query) => {
    if (!query) return; // Don't search if query is empty
    const response = await fetch('http://localhost:3001/users/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ searchQuery: query }),
    });
    const data = await response.json();
    setSearchResults(data);
    setDropdownOpen(true);
  };

  useEffect(() => {
    // Debounce search to avoid too many requests
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      getUsersBySearch(searchQuery);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(debounceTimeoutRef.current);
    };
  }, [searchQuery]);

  // Handle search input change
  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle result click (navigate to user profile)
  const handleResultClick = (result) => {
    navigate(`/profile/${result._id}`);
    setDropdownOpen(false);
  };

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        {/* Logo */}
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          Twitter
        </Typography>
      </FlexBetween>

      {/* Search and icons section */}
      <FlexBetween padding="1rem 6%" gap="2rem">
        <FlexBetween
          backgroundColor={neutralLight}
          borderRadius="9px"
          gap="3rem"
          padding="0.1rem 1.5rem"
          position="relative"
          ref={dropdownRef}
        >
          {/* Search input */}
          <InputBase
            placeholder="Search..."
            value={searchQuery}
            onChange={handleChange}
          />
          <IconButton onClick={() => getUsersBySearch(searchQuery)}>
            <Search />
          </IconButton>

          {/* Dropdown with search results */}
          {dropdownOpen && (
            <Paper
              sx={{
                position: 'absolute',
                zIndex: 1,
                top: '100%',
                left: 0,
                right: 0,
                maxHeight: '20rem',
                overflowY: 'auto',
                width: '100%'
              }}
            >
              {searchResults.map(result => (
                <MenuItem key={result._id} onClick={() => handleResultClick(result)}>
                  <FlexBetween gap="1rem">
                    <UserImage image={result.profilePicturePath} size="55px" />
                    <Typography
                      variant="h4"
                      color={main}
                      fontWeight="500"
                      sx={{
                        "&:hover": {
                          color: palette.primary.light,
                          cursor: "pointer",
                        },
                      }}
                    >
                      {result.name}
                    </Typography>
                  </FlexBetween>
                </MenuItem>
              ))}
            </Paper>
          )}
        </FlexBetween>

        {/* Theme toggle */}
        <IconButton onClick={() => dispatch(setMode())}>
          {theme.palette.mode === "dark" ? (
            <DarkMode sx={{ fontSize: "25px" }} />
          ) : (
            <LightMode sx={{ color: dark, fontSize: "25px" }} />
          )}
        </IconButton>

        {/* Profile management */}
        <IconButton onClick={() => navigate(`/editProfile/${loggedInUserId}`)}>
          <ManageAccountsIcon fontSize="large" sx={{ color: dark }} />
        </IconButton>

        {/* Logout */}
        <IconButton onClick={() => dispatch(setLogout())}>
          <LogoutIcon fontSize="large" sx={{ color: dark }} />
        </IconButton>
      </FlexBetween>
    </FlexBetween>
  );
};

export default Navbar;