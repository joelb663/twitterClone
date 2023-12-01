import Post from "../models/Post.js";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";

/* CREATE */
/*
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};
*/

export const createPost = async (req, res) => {
  try {
    const {
      userId,
      tag,
      description,
      postPicturePath,
    } = req.body;

    if (!description && !postPicturePath)
      throw new Error('ERROR: description and postPicturePath cannot be null');

    const user = await UserProfile.findById(userId);

    const newPost = new Post({
      userId,
      name: user.name,
      tag: tag,
      description: description,
      postPicturePath: postPicturePath,
      likes: {},
      replies: [],
      profilePicturePath: user.profilePicturePath
    });
    await newPost.save();
    user.posts.push(newPost.id);
    await user.save();

    let feed = await Post.find();
    feed = feed.filter(function (post) {
      if (!post.replyingTo)
        return post
    });
  
    feed.sort((a, b) => b.createdAt - a.createdAt);
    res.status(201).json(feed);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    let feed = await Post.find();
    feed = feed.filter(function (post) {
      if (!post.replyingTo)
        return post
    });

    feed.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json(feed);
  } catch (err){
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserProfile.findById(userId);

    let posts = await Promise.all(
      user.posts.map((id) => Post.findById(id))
    );
    posts = posts.filter(function (post) {
      if (!post.replyingTo)
        return post
    });

    posts.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getPostsByTag = async (req, res) => {
  try {
    const { tag } = req.params;

    let posts = await Post.find({tag: {$regex: new RegExp(`^${tag}$`, 'i' )}});
    posts = posts.filter(function (post) {
      if (!post.replyingTo)
        return post
    });

    posts.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getPostsByUsersFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserProfile.findById(userId);

    const following = await Promise.all(
      user.following.map((id) => UserProfile.findById(id))
    );

    let postIDs = [];
    following.forEach((user) => {
      postIDs = postIDs.concat(user.posts);
    });

    let posts = await Promise.all(
      postIDs.map((id) => Post.findById(id))
    );
    posts = posts.filter(function (post) {
      if (!post.replyingTo)
        return post
    });

    posts.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
/*
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
*/

export const likeUnlikePost = async (req, res) =>{
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    const user = await UserProfile.findById(userId);

    if (isLiked) {
      post.likes.delete(userId);
      const index = user.likes.indexOf(id);
      if (index > -1)
        user.likes.splice(index, 1);
    } else {
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

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    const { 
      description,
      postPicturePath,
    } = req.body;

    if (!description && !postPicturePath)
      throw new Error('ERROR: description and postPicturePath cannot be null');

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

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    // this code grabs the users that liked the post and deletes the postId from their likes array
    const userIdsWhoLiked = Array.from(post.likes.keys());
    const usersWhoLiked = await Promise.all(
      userIdsWhoLiked.map((id) => UserProfile.findById(id))
    );

    usersWhoLiked.forEach((user) => {
      const index = user.likes.indexOf(id);
      if (index > -1)
        user.likes.splice(index, 1);
      user.save();
    });
    
    // this code deletes the replying post and updates the users replies array
    async function filterReplies(value){
      const post = await Post.findById(value);
      const user = await UserProfile.findById(post.userId);
      await Post.findByIdAndDelete(post.id);

      const index = user.replies.indexOf(post.id);
      if (index > -1)
        user.replies.splice(index, 1);
      await user.save();
    }

    await Promise.all(
      post.replies.map( async (postId) => {
        await filterReplies(postId)
      })
    );

    // this code deletes the postId from the users post array
    const user = await UserProfile.findById(post.userId);
    const index = user.posts.indexOf(id);
    if (index > -1)
      user.posts.splice(index, 1);
    user.save();
    
    const postDeleted = await Post.findByIdAndDelete(id);
    res.status(200).json(postDeleted);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const createReply = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      userId,
      tag,
      description,
      postPicturePath,
    } = req.body;

    if (!description && !postPicturePath)
      throw new Error('ERROR: description and postPicturePath cannot be null');

    const post = await Post.findById(id);
    const user = await UserProfile.findById(userId);

    const newPost = new Post({
      userId,
      name: user.name,
      tag: tag,
      description: description,
      postPicturePath: postPicturePath,
      likes: {},
      replies: [],
      profilePicturePath: user.profilePicturePath,
      replyingTo: id
    });
    await newPost.save();

    post.replies.push(newPost.id);
    user.replies.push(newPost.id);

    await post.save();
    await user.save();
    
    let feed = await Post.find();
    feed = feed.filter(function (post) {
      if (!post.replyingTo)
        return post
    });

    feed.sort((a, b) => b.createdAt - a.createdAt);
    res.status(201).json(feed);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};