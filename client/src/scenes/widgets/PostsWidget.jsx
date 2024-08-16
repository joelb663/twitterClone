import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PostWidget from "./PostWidget";
import { setPosts } from "state";

const PostsWidget = ({ userId, postOption }) => {
  const dispatch = useDispatch();
  
  // Selector to get the authentication token and list of posts from the Redux store
  const token = useSelector((state) => state.token);
  const posts = useSelector((state) => state.posts);

  // Function to fetch posts created by the specified user
  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts(data)); // Dispatch action to update the posts in the Redux store
  };

  // Function to fetch posts liked by the specified user
  const getPostLikedByUser = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/postsByLikes`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts(data)); // Dispatch action to update the posts in the Redux store
  };

  // Function to fetch replies made by the specified user
  const getRepliesByUser = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/replies`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts(data)); // Dispatch action to update the posts in the Redux store
  };

  // useEffect hook to fetch posts based on the postOption parameter
  useEffect(() => {
    switch (postOption) {
      case 0:
        getUserPosts(); // Fetch posts created by the user
        break;
      case 1:
        getRepliesByUser(); // Fetch replies made by the user
        break;
      case 2:
        getPostLikedByUser(); // Fetch posts liked by the user
        break;
      default:
        console.log("Feed already loaded");
        break;
    }
  }, [postOption, userId, token]); // Dependencies for the useEffect hook

  return (
    <>
      {posts.map((
        { _id, userId, name, description, postPicturePath, profilePicturePath, likes, replies }
      ) => (
        <PostWidget
          key={_id} // Unique key for each post
          postId={_id}
          userId={userId}
          name={name}
          description={description}
          postPicturePath={postPicturePath}
          profilePicturePath={profilePicturePath}
          likes={likes}
        />
      ))}
    </>
  );
};

export default PostsWidget;