import { Box, Typography, useTheme, IconButton } from "@mui/material";
import { PersonAddOutlined } from "@mui/icons-material";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import { useNavigate } from "react-router-dom";
import { setFollowing, deleteUserYouMightLike, deleteUserToFollow } from "state";

const UsersYouMightLikeWidget = ({ id }) => {
    // Hook to navigate between routes and Hook to dispatch Redux actions
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Selectors to get the authentication token and list of users you might like from the Redux store
    const token = useSelector((state) => state.token);
    const usersYouMightLike = useSelector((state) => state.usersYouMightLike);

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
        dispatch(setFollowing(data));
        dispatch(deleteUserYouMightLike(userId));
        dispatch(deleteUserToFollow(userId));
    };

    return (
        <WidgetWrapper>
            <Box display="flex" flexDirection="column" gap="1rem">
                <span style={{
                    color: dark,
                    fontSize: 'large',
                    fontWeight: '500',
                }}>   
                    You might like
                </span>
                
                {usersYouMightLike.map((user) => (
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
                    ))
                }
            </Box>
        </WidgetWrapper>
    );
};

export default UsersYouMightLikeWidget;