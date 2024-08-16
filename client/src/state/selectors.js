import { createSelector } from 'reselect';

// Assuming state.posts is an array of posts
const selectPosts = (state) => state.posts;

// Create a selector to find the post by ID and return its replies
const selectReplies = createSelector(
  [selectPosts, (state, postId) => postId],
  (posts, postId) => {
    const post = posts.find(post => post._id === postId);
    return post ? post.replies : [];
  }
);

export { selectReplies };