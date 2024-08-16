import Post from "../models/Post.js";
import UserProfile from "../models/UserProfile.js";

/* CREATE */

// Function to create a new post
export const createPost = async (req, res) => {
  try {
    const {
      userId,
      description,
      postPicturePath,
    } = req.body;

    // Throw an error if both description and postPicturePath are missing
    if (!description && !postPicturePath) {
      throw new Error('Description and postPicturePath cannot be null');
    }

    // Find the user by userId
    const user = await UserProfile.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create a new post
    const newPost = new Post({
      userId,
      name: user.name,
      description,
      postPicturePath,
      likes: {},
      replies: [],
      profilePicturePath: user.profilePicturePath,
      createdAt: new Date(),
    });

    // Save the new post and add it to the user's posts
    await newPost.save();
    user.posts.push(newPost.id);
    await user.save();

    // Fetch all posts for the feed, excluding replies
    let feed = await Post.find();
    feed = feed.filter(function (post) {
      if (!post.parentPostId)
        return post
    });

    // Sort the feed by creation date in descending order
    feed.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(feed);
  } catch (err) {
    console.error(err);
    res.status(409).json({ message: err.message });
  }
};

// Function to create a reply to a post
export const createReply = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      userId,
      description,
      postPicturePath,
      replyingTo
    } = req.body;

    // Throw an error if both description and postPicturePath are missing
    if (!description && !postPicturePath)
      throw new Error('ERROR: description and postPicturePath cannot be null');

    // Find the post being replied to and the user creating the reply
    const post = await Post.findById(id);
    const user = await UserProfile.findById(userId);

    // Create a new reply post
    const newPost = new Post({
      userId,
      name: user.name,
      description: description,
      postPicturePath: postPicturePath,
      likes: {},
      replies: [],
      profilePicturePath: user.profilePicturePath,
      parentPostId: id,
      replyingTo: replyingTo
    });
    await newPost.save();

    // Add the new reply to the original post's replies and the user's replies
    post.replies.push(newPost);
    user.replies.push(newPost.id);

    await post.save();
    await user.save();
    
    res.status(201).json(newPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Function to get all posts for the feed
export const getFeedPosts = async (req, res) => {
  try {
    let feed = await Post.find();
    feed = feed.filter(function (post) {
      if (!post.parentPostId)
        return post
    });

    // Sort the feed by creation date in descending order
    feed.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(feed);
  } catch (err){
    res.status(404).json({ message: err.message });
  }
};

// Function to get posts by a specific user
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserProfile.findById(userId);

    let posts = await Promise.all(
      user.posts.map((id) => Post.findById(id))
    );

    // Filter out replies
    posts = posts.filter(function (post) {
      if (!post.parentPostId)
        return post
    });

    // Sort the posts by creation date in descending order
    posts.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Function to get posts liked by a user
export const getPostsLikedByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserProfile.findById(userId);

    let likedPosts = await Promise.all(
      user.likes.map((id) => Post.findById(id))
    );

    // Sort the liked posts by creation date in descending order
    likedPosts.sort((a, b) => b.createdAt - a.createdAt);
    
    res.status(200).json(likedPosts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Function to get replies made by a user
export const getRepliesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserProfile.findById(userId);

    let replies = await Promise.all(
      user.replies.map((id) => Post.findById(id))
    );

    // Sort the replies by creation date in descending order
    replies.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(replies);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */

// Function to like or unlike a post
export const likeUnlikePost = async (req, res) =>{
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    const user = await UserProfile.findById(userId);

    if (isLiked) {
      // If the post is liked, unlike it
      post.likes.delete(userId);
      const index = user.likes.indexOf(id);
      if (index > -1)
        user.likes.splice(index, 1);
    } else {
      // If the post is not liked, like it
      post.likes.set(userId, true);
      user.likes.push(id);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    await user.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Function to update a post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    const { 
      description,
      postPicturePath,
    } = req.body;

    // Throw an error if both description and postPicturePath are missing
    if (!description && !postPicturePath)
      throw new Error('ERROR: description and postPicturePath cannot be null');

    // Allow post updates only within an hour of creation
    const currentDate = new Date();
    const difference = currentDate - post.createdAt;
    if (difference > 3600000)
      throw new Error('ERROR: you can only edit post within an hour of creation');
    
    post.description = description;
    post.postPicturePath = postPicturePath;
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */

// Function to delete a post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    // Remove the post from the likes array of all users who liked the post
    await UserProfile.updateMany(
      { _id: { $in: Array.from(post.likes.keys()) } },
      { $pull: { likes: id } }
    );

    // Remove the post from the replies array of all posts that have it
    await UserProfile.updateMany(
      { _id: { $in: post.replies } },
      { $pull: { replies: id } }
    );

    // Remove the post from the user's posts and replies array
    await UserProfile.findByIdAndUpdate(post.userId, {
      $pull: { posts: id },
    });

    await UserProfile.findByIdAndUpdate(post.userId, {
      $pull: { replies: id },
    });

    // If the post is a reply, remove it from the parent post's replies
    if (post.parentPostId) {
      await Post.findByIdAndUpdate(post.parentPostId, {
        $pull: { replies: id },
      });
    }

    const postDeleted = await Post.findByIdAndDelete(id);

    res.status(200).json(postDeleted);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};