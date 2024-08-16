import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import UserImage from "components/UserImage";
import { useNavigate } from "react-router-dom";
import CreateReplyWidget from "./CreateReplyWidget";
import EditPostWidget from "scenes/widgets/EditPostWidget";
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateContent, likeContent, addReply, deleteReply as deleteReplyAction, deletePost as deletePostAction } from "state";
import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import { selectReplies } from "state/selectors";
import { setFollowing, addUserToFollow, deleteUserToFollow, addUserYouMightLike, deleteUserYouMightLike } from "state"; 

// Helper function to sort and organize replies
function sortReplies(replies) {
    const sortedReplies = [];
    const replyMap = new Map();

    // Create a map of replies by ID for quick access
    replies.forEach(reply => {
        replyMap.set(reply._id, { ...reply, depth: 0 });
    });
    
    // Helper function to recursively add replies
    function addReplies(replyId, depth) {
        const reply = replyMap.get(replyId);
        if (reply) {
            reply.depth = depth;
            sortedReplies.push(reply);

            // Add child replies
            replies.forEach(childReply => {
                // Check if the reply references are valid and not cyclical
                if (childReply.replyingTo === replyId && childReply._id !== replyId) {
                    addReplies(childReply._id, depth + 1);
                }
            });
        }
    }
    
    // Start with top-level replies
    replies.forEach(reply => {
        // Handle both null and empty string cases for top-level replies
        if (reply.replyingTo === null || reply.replyingTo === "") {
            addReplies(reply._id, 0);
        }
    });
    
    return sortedReplies;
}

const PostWidget = ({
    postId,
    userId,
    name,
    description: initialDescription,
    postPicturePath: initialPostPicturePath,
    profilePicturePath,
    likes = {},
    parentPostId,
    replyingTo,
    depth
}) => {
    // Hook to dispatch Redux actions and Hook to navigate between routes
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Selector to get the authentication token, logged-in user's ID, following list, and replies for the specific post from the Redux store
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user.userId);
    const following = useSelector((state) => state.following);
    const replies = useSelector((state) => selectReplies(state, postId));
    
    // State variables for post interactions
    const [isLiked, setIsLiked] = useState(Boolean(likes[loggedInUserId]));
    const [likeCount, setLikeCount] = useState(Object.keys(likes).length);
    const [view, setView] = useState('');
    const [user, setUser] = useState(null);
    const [description, setDescription] = useState(initialDescription);
    const [postPicturePath, setPostPicturePath] = useState(initialPostPicturePath);

    // Theme palette
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;

    // Initial post data for editing
    const initialPost = {
        postId,
        description,
        postPicturePath
    };

    // Effect to update the liked status and like count
    useEffect(() => {
        if (likes && loggedInUserId) {
            setIsLiked(Boolean(likes[loggedInUserId]));
            setLikeCount(Object.keys(likes).length);
        }
    }, [likes, loggedInUserId]);

    // Effect to fetch the current user's data
    useEffect(() => {
        const getUser = async () => {
            const response = await fetch(`http://localhost:3001/users/${loggedInUserId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setUser(data);
        };

        getUser();
    }, [loggedInUserId, token]);

    // Function to follow or unfollow a user
    const followUnfollowUser = async (userId, isFollowing) => {
        const response = await fetch(`http://localhost:3001/users/${loggedInUserId}/${userId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();

        if (isFollowing) {
            dispatch(addUserToFollow(userId));
            dispatch(addUserYouMightLike(userId));
        } else {
            dispatch(deleteUserToFollow(userId));
            dispatch(deleteUserYouMightLike(userId));
        }
        dispatch(setFollowing(data));
    };

    // Function to like or unlike a post
    const patchLike = async () => {
        const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: loggedInUserId }),
        });
        const updatedPost = await response.json();
        setLikeCount(Object.keys(updatedPost.likes).length);
        setIsLiked(!isLiked);
        dispatch(likeContent({ contentId: postId, userId: loggedInUserId }));
    };

    // Function to create a reply to a post
    const handleCreateReply = async (userId, description, image, parentPostId, replyingTo) => {
        const data = {
            userId,
            description,
            postPicturePath: image ? image.name : null,
            parentPostId,
            replyingTo
        };

        const response = await fetch(`http://localhost:3001/posts/${parentPostId}/reply`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const newReply = await response.json();
        dispatch(addReply({ postId: parentPostId, newReply }));
        setView("");
    };

    // Function to edit a post
    const handleEditPost = async (updatedDescription, updatedPostPicturePath) => {
        const response = await fetch(`http://localhost:3001/posts/${postId}/updatePost`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ description: updatedDescription, postPicturePath: updatedPostPicturePath }),
        });
        const updatedPost = await response.json();
        setDescription(updatedPost.description);
        setPostPicturePath(updatedPost.postPicturePath);
        dispatch(updateContent({ contentId: postId, description: updatedPost.description, postPicturePath: updatedPost.postPicturePath }));
        setView('');
    };

    // Function to delete a post
    const deletePost = async () => {
        await fetch(`http://localhost:3001/posts/${postId}/deletePost`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (parentPostId) {
            dispatch(deleteReplyAction({ postId: parentPostId, replyId: postId }));
        } else {
            dispatch(deletePostAction({ postId }));
        }
    };

    // Handlers to toggle view states
    const handleIconClick = () => {
        setView(view === 'replies' ? '' : 'replies');
    };

    const handleIconClick2 = () => {
        setView(view === 'createReply' ? '' : 'createReply');
    };

    const handleIconClick3 = () => {
        setView(view === 'edit' ? '' : 'edit');
    };

    const handleIconClick4 = () => {
        deletePost();
    };

    // Check if the current user is following the post's user
    const isFollowing = following && following.some(obj => obj._id === userId);
    // Check if the current user is the post's owner
    const isSelfPost = userId === loggedInUserId;
    // Reverse and sort replies for display
    const reversedReplies = [...replies].reverse();
    const sortedReplies = sortReplies(reversedReplies);

    return (
        <WidgetWrapper key={postId} m={parentPostId ? "0 0" : "2rem 0"}>
            {parentPostId && <Divider sx={{ mt: '0rem', mb: '1rem' }} />}
            <FlexBetween>
                <FlexBetween gap="1rem">
                    <UserImage image={profilePicturePath} size="55px" />
                    <Box
                        onClick={() => {
                            navigate(`/profile/${userId}`);
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
                            {name}
                        </Typography>
                    </Box>
                </FlexBetween>
                {!isSelfPost && (
                    <IconButton
                        onClick={() => followUnfollowUser(userId, isFollowing)}
                        sx={{ backgroundColor: primaryLight, p: '0.6rem' }}
                    >
                        {isFollowing ? (
                            <PersonRemoveOutlined sx={{ color: primaryDark }} />
                        ) : (
                            <PersonAddOutlined sx={{ color: primaryDark }} />
                        )}
                    </IconButton>
                )}
            </FlexBetween>

            <Typography color={main} sx={{ mt: "1rem" }}>
                {description}
            </Typography>

            {postPicturePath && (
                <img
                    width="100%"
                    height="auto"
                    alt="post"
                    style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
                    src={`http://localhost:3001/assets/${postPicturePath}`}
                />
            )}

            <FlexBetween mt="0.25rem">
                <FlexBetween gap="1rem">
                    <FlexBetween gap="0.3rem">
                        <IconButton
                            onClick={() => patchLike()}
                        >
                            {isLiked ? (
                                <FavoriteOutlined sx={{ color: primary }} />
                            ) : (
                                <FavoriteBorderOutlined />
                            )}
                        </IconButton>
                        <Typography>{likeCount}</Typography>
                    </FlexBetween>
                    
                    {!parentPostId  && (
                        <FlexBetween gap="0.3rem">
                            <IconButton onClick={handleIconClick}>
                                <ChatBubbleOutlineOutlined />
                            </IconButton>
                            <Typography>{replies.length}</Typography>
                        </FlexBetween>
                    )}

                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={handleIconClick2}>
                            <ReplyIcon />
                        </IconButton>
                    </FlexBetween>
                </FlexBetween>

                {isSelfPost && (
                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={handleIconClick3}>
                            <EditIcon />
                        </IconButton>

                        <IconButton onClick={handleIconClick4}>
                            <DeleteIcon />
                        </IconButton>
                    </FlexBetween>
                )}
            </FlexBetween>

            {view === 'createReply' && (
                <Box>
                    <Typography variant="h5" color={main} fontWeight="500" p="1rem"> Replying to {name}</Typography>
                    <CreateReplyWidget
                        id={loggedInUserId}
                        profilePicturePath={user.profilePicturePath}
                        parentPostId={parentPostId || postId}
                        replyingTo={parentPostId ? postId : null}
                        onSubmit={handleCreateReply}
                    />
                </Box>
            )}

            {view === 'replies' && (
                <Box>
                    {sortedReplies.map((reply) => (
                        <Box key={reply._id} sx={{ ml: reply.depth * 4 }}>
                            <PostWidget
                                postId={reply._id}
                                userId={reply.userId}
                                name={reply.name}
                                description={reply.description}
                                postPicturePath={reply.postPicturePath}
                                profilePicturePath={reply.profilePicturePath}
                                likes={reply.likes}
                                parentPostId={reply.parentPostId}
                                replyingTo={reply.replyingTo}
                                depth={reply.depth}
                            />
                        </Box>
                    ))}
                </Box>
            )}

            {view === 'edit' && (
                <Box>
                    <Typography variant="h5" color={main} fontWeight="500" p="1rem"> Editing post</Typography>
                    <EditPostWidget 
                        id={loggedInUserId} 
                        profilePicturePath={profilePicturePath} 
                        initialPost={initialPost}
                        onSubmit={handleEditPost}
                    />
                </Box>
            )}
        </WidgetWrapper>
    );
};

export default PostWidget;