import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import UsersToFollowWidget from "scenes/widgets/UsersToFollowWidget";
import UsersYouMightLikeWidget from "scenes/widgets/UsersYouMightLikeWidget";
import { useEffect, useState } from "react";
import CreatePostWidget from "scenes/widgets/CreatePostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import { setPosts, setFollowing, setFollowers, setUsersToFollow, setUsersYouMightLike } from "state";

const HomePage = () => {
    // Get userId and token from the Redux store
    const { userId } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    
    // Local state to hold user data
    const [user, setUser] = useState(null);

    // Initialize the Redux dispatch function
    const dispatch = useDispatch();

    // Function to fetch the user's data based on the userId
    const getUser = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data); // Update local state with fetched user data
    };

    // Function to fetch the user's followers and update the Redux store
    const getFollowers = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}/followers`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setFollowers(data)); // Update followers in the Redux store
    };

    // Function to fetch the users the current user is following and update the Redux store
    const getFollowing = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}/following`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setFollowing(data)); // Update following in the Redux store
    };

    // Function to fetch a list of users to follow and update the Redux store
    const getUsersToFollow = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}/usersToFollow`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setUsersToFollow(data)); // Update users to follow in the Redux store
    };

    // Function to fetch a list of users the current user might like and update the Redux store
    const getUsersYouMightLike = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}/usersYouMightLike`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setUsersYouMightLike(data)); // Update users you might like in the Redux store
    };

    // Function to fetch all posts and update the Redux store
    const getPosts = async () => {
        const response = await fetch("http://localhost:3001/posts", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setPosts(data)); // Update posts in the Redux store
    };

    // Fetch all necessary data when the component mounts
    useEffect(() => {
        getUser();
        getFollowing();
        getFollowers();
        getUsersToFollow();
        getUsersYouMightLike();
        getPosts();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // If user data is not yet available, return null to avoid rendering the page
    if (!user) {
        return null;
    }

    return (
        <Box>
            <Navbar />
            <Box
                width="100%"
                padding="2rem 6%"
                display="flex"
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box flexBasis="26%">
                    <UserWidget user={user} />
                </Box>

                <Box flexBasis="42%">
                    <CreatePostWidget id={userId} profilePicturePath={user.profilePicturePath} />
                    <PostsWidget userId={userId} />
                </Box>

                <Box flexBasis="26%">
                    <UsersToFollowWidget id={userId} />
                    <Box m="2rem 0" />
                    <UsersYouMightLikeWidget id={userId} />
                </Box>
            </Box>
        </Box>
    );
};

export default HomePage;