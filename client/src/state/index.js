import { createSlice } from "@reduxjs/toolkit";

// Initial state of the auth slice
const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  following: [],
  followers: [],
  usersToFollow: [],
  usersYouMightLike: [],
};

// Create a Redux slice named "auth" with initial state and reducers
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Toggle between light and dark mode
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    // Set the user and token upon login
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    // Clear the user and token upon logout
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    // Set the list of posts
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    // Delete a specific post by ID
    deletePost: (state, action) => {
      state.posts = state.posts.filter(post => post._id !== action.payload.postId);
    },
    // Add a new reply to a specific post
    addReply: (state, action) => {
      const { postId, newReply } = action.payload;
      const post = state.posts.find(post => post._id === postId);
      if (post) {
        if (!post.replies) {
          post.replies = [];
        }
        post.replies = [...post.replies, newReply];
      }
    },
    // Delete a specific reply by post ID and reply ID
    deleteReply: (state, action) => {
      const { postId, replyId } = action.payload;
      const post = state.posts.find(post => post._id === postId);
      if (post) {
        post.replies = post.replies.filter(reply => reply._id !== replyId);
      }
    },
    // Set the list of users the current user is following
    setFollowing: (state, action) => {
      state.following = action.payload;
    },
    // Set the list of followers of the current user
    setFollowers: (state, action) => {
      state.followers = action.payload;
    },
    // Set the list of suggested users to follow
    setUsersToFollow: (state, action) => {
      state.usersToFollow = action.payload;
    },
    // Set the list of users the current user might like
    setUsersYouMightLike: (state, action) => {
      state.usersYouMightLike = action.payload;
    },
    // Delete a user from the usersToFollow list by ID
    deleteUserToFollow: (state, action) => {
      const userId = action.payload;
      state.usersToFollow = state.usersToFollow.filter(user => user._id !== userId);
    },
    // Add a user to the usersToFollow list by ID
    addUserToFollow: (state, action) => {
      const userId = action.payload;
      const user = state.following.find(user => user._id === userId);
      if (user) {
          state.usersToFollow.push(user);
      }
    },
    // Delete a user from the usersYouMightLike list by ID
    deleteUserYouMightLike: (state, action) => {
      const userId = action.payload;
      state.usersYouMightLike = state.usersYouMightLike.filter(user => user._id !== userId);
    },
    // Add a user to the usersYouMightLike list by ID
    addUserYouMightLike: (state, action) => {
      const userId = action.payload;
      const user = state.following.find(user => user._id === userId);
      if (user) {
          state.usersYouMightLike.push(user);
      }
    },
    // Like or unlike a content (post or reply)
    likeContent: (state, action) => {
      const { contentId, userId } = action.payload;
      const target = state.posts.flatMap(post => post.replies).find(reply => reply._id === contentId);
    
      if (target) {
        if (!target.likes) {
          target.likes = {};
        }
        if (target.likes[userId]) {
          delete target.likes[userId];
        } else {
          target.likes[userId] = true;
        }
      }
    },  
    // Update content description and post picture
    updateContent: (state, action) => {
      const { contentId, description, postPicturePath } = action.payload;
    
      // Find the target reply based on contentId
      const target = state.posts.flatMap(post => post.replies).find(reply => reply._id === contentId);
    
      if (target) {
        // Update description and postPicturePath for the target reply
        target.description = description;
        target.postPicturePath = postPicturePath;
    
        // Update the specific reply within its parent post
        state.posts = state.posts.map(post => {
          if (post.replies) {
            post.replies = post.replies.map(reply =>
              reply._id === contentId ? target : reply
            );
          }
          return post;
        });
      }
    },
  },
});

// Export the actions and reducer of the auth slice
export const {
  setMode,
  setLogin,
  setLogout,
  setPosts,
  deletePost,
  addReply,
  deleteReply,
  setFollowing,
  setFollowers,
  setUsersToFollow,
  setUsersYouMightLike,
  deleteUserToFollow,
  addUserToFollow,
  deleteUserYouMightLike,
  addUserYouMightLike,
  likeContent,
  updateContent
} = authSlice.actions;

export default authSlice.reducer;