import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import WidgetWrapper from "components/WidgetWrapper";
import { Box, Tabs, Tab } from "@mui/material";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";

const ProfilePage = () => {
  const { userId } = useParams(); // Get the user ID from the URL parameters
  const token = useSelector((state) => state.token); // Get the authentication token from Redux state
  const [user, setUser] = useState(null); // State to store user data
  const [tabIndex, setTabIndex] = useState(0); // State to manage which tab is currently selected

  useEffect(() => {
    // Fetch user data when component mounts or userId/token changes
    const getUser = async () => {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }, // Pass the token in the request headers
      });
      const data = await response.json(); // Parse the response as JSON
      setUser(data); // Store the fetched user data in state
    };

    getUser();
  }, [userId, token]); // Re-run the effect if userId or token changes

  if (!user) {
    return null; // Render nothing if user data is not yet loaded
  }

  return (
    <Box>
      <Navbar /> {/* Navbar component */}
      <Box
        width="100%"
        padding="2rem 6%"
        display="flex"
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis="25%">
          <UserWidget user={user} /> {/* User profile widget */}
        </Box>

        <WidgetWrapper flexBasis="75%">
          <Box>
            {/* Tab navigation for Posts, Replies, and Likes */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabIndex} 
                onChange={(e, newValue) => setTabIndex(newValue)} // Update selected tab
                centered
              >
                <Tab label="Posts" />
                <Tab label="Replies" />
                <Tab label="Likes" />
              </Tabs>
            </Box>
            <Box>
              {/* Display posts, replies, or likes based on selected tab */}
              <PostsWidget userId={userId} postOption={tabIndex} />
            </Box>
          </Box>
        </WidgetWrapper>
      </Box>
    </Box>
  );
};

export default ProfilePage;