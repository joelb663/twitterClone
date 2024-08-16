import { Box, Typography, useTheme, IconButton, Divider } from "@mui/material";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import { 
    setFollowing, 
    addUserToFollow, 
    deleteUserToFollow, 
    addUserYouMightLike, 
    deleteUserYouMightLike 
} from "state";
import { useNavigate } from "react-router-dom";

const FollowersListWidget = ({ id }) => {
    // Hook to navigate between routes and Hook to dispatch Redux actions
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Selectors to retrieve the authentication token, following and followers list of the logged-in user from the Redux store
    const token = useSelector((state) => state.token);
    const following = useSelector((state) => state.following);
    const followers = useSelector((state) => state.followers);

    // Theme palette
    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
    const dark = palette.neutral.dark;

    // Function to handle follow/unfollow actions
    const followUnfollowUser = async (userId, isFollowing) => {
        const response = await fetch(`http://localhost:3001/users/${id}/${userId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ isFollowing }),
        });
        const data = await response.json();

        // Update the state depending on the follow/unfollow action
        if (isFollowing) {
            dispatch(addUserToFollow(userId));
            dispatch(addUserYouMightLike(userId));
        } else {
            dispatch(deleteUserToFollow(userId));
            dispatch(deleteUserYouMightLike(userId));
        }
        dispatch(setFollowing(data));
    };

    return (
        <Box display="flex" flexDirection="column" gap="1rem">
            <Divider />
            <Typography
                style={{ color: dark, fontSize: 'large', fontWeight: '500' }}
            >
                Followers
            </Typography>

            {followers.map((user) => {
                const isFollowing = following && following.some(obj => obj._id === user._id);
                return (
                    <Box key={user._id} mb={2}>
                        <FlexBetween>
                            <FlexBetween gap="1rem">
                                <UserImage image={user.profilePicturePath} size="55px" />
                                <Box
                                    onClick={() => navigate(`/profile/${user._id}`)}
                                    sx={{
                                        "&:hover": {
                                            cursor: "pointer",
                                        }
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        color={main}
                                        fontWeight="500"
                                        sx={{
                                            "&:hover": {
                                                color: palette.primary.light,
                                            },
                                        }}
                                    >
                                        {user.name}
                                    </Typography>
                                    <Typography color={medium} fontSize="0.75rem">
                                        {user.bio}
                                    </Typography>
                                </Box>
                            </FlexBetween>
                            <IconButton
                                onClick={() => followUnfollowUser(user._id, isFollowing)}
                                sx={{ backgroundColor: primaryLight, p: '0.6rem' }}
                            >
                                {isFollowing ? (
                                    <PersonRemoveOutlined sx={{ color: primaryDark }} />
                                ) : (
                                    <PersonAddOutlined sx={{ color: primaryDark }} />
                                )}
                            </IconButton>
                        </FlexBetween>
                    </Box>
                );
            })}
        </Box>
    );
};

export default FollowersListWidget;