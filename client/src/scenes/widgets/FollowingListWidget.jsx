import { Box, Typography, useTheme, IconButton, Divider } from "@mui/material";
import { PersonRemoveOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import { useNavigate } from "react-router-dom";
import { setFollowing, addUserToFollow, addUserYouMightLike } from "state"; 

const FollowingListWidget = ({ id }) => {
    // Hook to navigate between routes and Hook to dispatch Redux actions
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Selectors to get the authentication token and follwoing list from the Redux store
    const token = useSelector((state) => state.token);
    const following = useSelector((state) => state.following);

    // Theme palette
    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
    const dark = palette.neutral.dark;

    // Function to handle follow/unfollow actions
    const followUnfollowUser = async (userId) => {
        const response = await fetch(`http://localhost:3001/users/${id}/${userId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        
        // Update the state depending on the follow/unfollow action
        dispatch(addUserToFollow(userId));
        dispatch(addUserYouMightLike(userId));
        dispatch(setFollowing(data));
    };

    return (
        <Box display="flex" flexDirection="column" gap="1rem">
            <Divider />

            <span style={{
                color: dark,
                fontSize: 'large',
                fontWeight: '500',
            }}>
                Following
            </span>
            
            {following.map((user) => (
                <div key={user._id}>
                    <FlexBetween>
                        <FlexBetween gap="1rem">
                            <UserImage image={user.profilePicturePath} size="55px" />
                            <Box
                                onClick={() => {
                                    navigate(`/profile/${user._id}`);
                                }}
                            >
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
                                    {user.name}
                                </Typography>
                                
                                <div style={{ color: medium, fontSize: '0.75rem' }}>
                                    {user.bio}
                                </div>
                            </Box>
                        </FlexBetween>
                        <IconButton
                            onClick={() => followUnfollowUser(user._id)}
                            sx={{ backgroundColor: primaryLight, p: '0.6rem' }}
                        >
                            <PersonRemoveOutlined sx={{ color: primaryDark }} />
                        </IconButton>
                    </FlexBetween>
                </div>
            ))}
        </Box>
    );
};

export default FollowingListWidget;