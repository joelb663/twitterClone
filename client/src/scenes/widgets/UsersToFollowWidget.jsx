import { Box, Typography, useTheme, IconButton } from "@mui/material";
import { PersonAddOutlined } from "@mui/icons-material";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import { useNavigate } from "react-router-dom";
import { setFollowing, deleteUserToFollow, deleteUserYouMightLike } from "state"

const UsersToFollowWidget = ({ id }) => {
    // Hook to navigate between routes and Hook to dispatch Redux actions
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Selectors to get the authentication token and list of users to follow from the Redux store
    const token = useSelector((state) => state.token); 
    const usersToFollow = useSelector((state) => state.usersToFollow);

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
        
        dispatch(setFollowing(data));
        dispatch(deleteUserToFollow(userId));
        dispatch(deleteUserYouMightLike(userId));
    };

    return (
        <WidgetWrapper>
            <Box display="flex" flexDirection="column" gap="1rem">
                <span style={{
                    color: dark,
                    fontSize: 'large',
                    fontWeight: '500',
                }}>
                    Who to follow
                </span>
                
                {usersToFollow.map((user) => (
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
                                <PersonAddOutlined sx={{ color: primaryDark }} />
                            </IconButton>
                        </FlexBetween>
                    </div>
                ))}
            </Box>
        </WidgetWrapper>
    );
};

export default UsersToFollowWidget;