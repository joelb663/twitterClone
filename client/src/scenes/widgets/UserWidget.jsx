import {
  EditOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import FollowingListWidget from "scenes/widgets/FollowingListWidget";
import FollowersListWidget from "scenes/widgets/FollowersListWidget";
import { useSelector } from "react-redux";

const UserWidget = ({ user }) => {
    // Navigation hook to redirect user
    const navigate = useNavigate();

    // Redux selectors to get following and followers data from the state
    const following = useSelector((state) => state.following);
    const followers = useSelector((state) => state.followers);

    // Local state to manage the visibility of following and followers list
    const [showFollowingList, setShowFollowingList] = useState(false);
    const [showFollowersList, setShowFollowersList] = useState(false);

    // Theme hook to get color palette from the theme
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

    // Destructuring user properties for easy access
    const {
        name,
        bio,
        createdAt,
        profilePicturePath,
        location
    } = user;

    // Handlers to toggle following and followers list visibility
    const handleShowFollowingList = () => {
        setShowFollowingList(true);
        setShowFollowersList(false); 
    };

    const handleShowFollowersList = () => {
        setShowFollowingList(false);
        setShowFollowersList(true);
    };

    return (
        <WidgetWrapper>
            {/* FIRST ROW */}
            <FlexBetween
                gap="0.5rem"
                pb="1.1rem"
                onClick={() => navigate(`/profile/${user._id}`)}
            >
                <FlexBetween gap="1rem">
                    <UserImage image={profilePicturePath} />
                    <Box>
                        <Typography
                            variant="h4"
                            color={dark}
                            fontWeight="500"
                            sx={{
                                "&:hover": {
                                    color: palette.primary.light,
                                    cursor: "pointer",
                                },
                            }}
                        >
                            {name}
                        </Typography>

                        <Typography color={medium}>{bio}</Typography>
                    </Box>
                </FlexBetween>
            </FlexBetween>

            <Divider />

            {/* SECOND ROW */}
            <Box p="1rem 0" height="100%" display="flex" justifyContent="space-around">
                <Typography
                    onClick={handleShowFollowingList}
                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    style={{ cursor: 'pointer' }}
                >
                    {following.length} following
                </Typography>

                <Typography
                    onClick={handleShowFollowersList}
                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    style={{ cursor: 'pointer' }}
                >
                    {followers.length} followers
                </Typography>
            </Box>

            <Divider />

            {/* THIRD ROW */}
            <Box p="1rem 0" height="100%" display="flex" flexDirection="column" justifyContent="space-around">
                <Box display="flex" alignItems="center" gap="1rem">
                    <LocationOnOutlined fontSize="large" sx={{ color: main }} />
                    <Typography color={main}>{location}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="1rem">
                    <CalendarMonthIcon fontSize="large" sx={{ color: main }} />
                    <Typography color={main}>Joined {createdAt.substring(0, 10)}</Typography>
                </Box>
            </Box>

            <Divider />

            {/* FOURTH ROW */}
            <Box p="1rem 0">
                <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
                    Social Profiles
                </Typography>

                <FlexBetween gap="1rem">
                    <FlexBetween gap="1rem">
                        <InstagramIcon fontSize="large" sx={{ color: main }} />
                        <Box>
                            <Typography color={main} fontWeight="500">
                                Instagram
                            </Typography>
                            <Typography color={medium}>Social Network</Typography>
                        </Box>
                    </FlexBetween>
                    <EditOutlined sx={{ color: main }} />
                </FlexBetween>

                <FlexBetween gap="1rem">
                    <FlexBetween gap="1rem">
                        <LinkedInIcon fontSize="large" sx={{ color: main }} />
                        <Box>
                            <Typography color={main} fontWeight="500">
                                Linkedin
                            </Typography>
                            <Typography color={medium}>Network Platform</Typography>
                        </Box>
                    </FlexBetween>
                    <EditOutlined sx={{ color: main }} />
                </FlexBetween>
            </Box>

            {showFollowingList && <FollowingListWidget id={user._id} />}
            {showFollowersList && <FollowersListWidget id={user._id} />}
            
        </WidgetWrapper>
    );
};

export default UserWidget;