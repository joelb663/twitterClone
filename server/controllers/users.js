import UserProfile from "../models/UserProfile.js";

/* READ */

// Retrieves a user's profile by their ID
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserProfile.findById(id);

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Retrieves the followers of a user by their ID
export const getFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserProfile.findById(id);

    // Fetch all the followers' profiles
    const followers = await Promise.all(
      user.followers.map((id) => UserProfile.findById(id))
    );
    // Format the followers' information to include only specific fields
    const formattedFollowers = followers.map(
      ({ _id, name, bio, profilePicturePath }) => {
        return { _id, name, bio, profilePicturePath };
      }
    );
    res.status(200).json(formattedFollowers);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Retrieves the users that a specific user is following by their ID
export const getFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserProfile.findById(id);

    // Fetch all the profiles of the users this user is following
    const following = await Promise.all(
      user.following.map((id) => UserProfile.findById(id))
    );
    // Format the following users' information to include only specific fields
    const formattedFollowing = following.map(
      ({ _id, name, bio, profilePicturePath }) => {
        return { _id, name, bio, profilePicturePath };
      }
    );
    res.status(200).json(formattedFollowing);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Retrieves users based on a search query
export const getUsersBySearch = async (req, res) => {
  try {
    const { searchQuery } = req.body;
    // Find users with names that match the search query (case insensitive)
    const usersFound = await UserProfile.find({ name: { $regex: searchQuery, $options: 'i' } });

    // Format the users' information to include only specific fields
    const formattedUsersFound = usersFound.map(
      ({ _id, name, profilePicturePath }) => {
        return { _id, name, profilePicturePath };
      }
    );
    res.status(200).json(formattedUsersFound);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Suggests users to follow excluding those already followed by the user
export const getUsersToFollow = async (req, res) => {
  try {
    const { id } = req.params;
    // Randomly sample 3 users from the database
    const users = await UserProfile.aggregate([{ $sample: { size: 3 } }]);

    const usersToFollow = [];
    users.forEach((user) => {
      // Check if the user is not already followed and is not the current user
      if (!user.followers.includes(id) && JSON.stringify(user._id) !== JSON.stringify(id)) {
        usersToFollow.push(user);
      }
    });
    // Format the users' information to include only specific fields
    const formattedUsersToFollow = usersToFollow.map(
      ({ _id, name, bio, profilePicturePath }) => {
        return { _id, name, bio, profilePicturePath };
      }
    );
    res.status(200).json(formattedUsersToFollow);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Suggests users that the current user might like based on their followers
export const getUsersYouMightLike = async (req, res) => {
  try {
    const { id } = req.params; // Current user ID

    // Get the current user to find who they follow
    const currentUser = await UserProfile.findById(id);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the list of users the current user is following
    const followedUsers = await Promise.all(
      currentUser.following.map((userId) => UserProfile.findById(userId))
    );

    // Set to keep track of users you might like to avoid duplicates
    const usersYouMightLikeSet = new Set();

    // Iterate through each followed user
    for (const followedUser of followedUsers) {
      // Fetch the followers of the followed user
      const followers = await Promise.all(
        followedUser.followers.map((followerId) => UserProfile.findById(followerId))
      );

      // Add users to the suggestion list if they are not the current user and not already followed
      for (const follower of followers) {
        if (follower._id.toString() !== id && !currentUser.following.includes(follower._id.toString())) {
          usersYouMightLikeSet.add(follower._id.toString());
        }
      }
    }

    // Convert the Set to an array and fetch detailed user info
    const usersYouMightLike = await Promise.all(
      Array.from(usersYouMightLikeSet).map(async (userId) => {
        const user = await UserProfile.findById(userId);
        return { _id: user._id, name: user.name, bio: user.bio, profilePicturePath: user.profilePicturePath };
      })
    );

    res.status(200).json(usersYouMightLike);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */

// Toggles the follow/unfollow state between two users
export const followUnfollowUser = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const user = await UserProfile.findById(id);
    const user2 = await UserProfile.findById(userId);

    if (user.following.includes(userId)) {
      // If user is already following userId, remove them from the following list
      user.following = user.following.filter((id) => id !== userId);
      user2.followers = user2.followers.filter((id) => id !== id);
    } else {
      // If not, add userId to the following list
      user.following.push(userId);
      user2.followers.push(id);
    }
    await user.save();
    await user2.save();

    // Fetch and format the updated following list
    const following = await Promise.all(
      user.following.map((id) => UserProfile.findById(id))
    );
    const formattedFollowing = following.map(
      ({ _id, name, bio, profilePicturePath }) => {
        return { _id, name, bio, profilePicturePath };
      }
    );
    res.status(200).json(formattedFollowing);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Updates the profile information of a user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserProfile.findById(id);

    const {
      name,
      gender,
      birthDate,
      bio,
      profilePicturePath,
      location
    } = req.body;

    // Update user fields with the new data
    user.name = name;
    user.gender = gender;
    user.birthDate = birthDate;
    user.bio = bio;
    user.profilePicturePath = profilePicturePath;
    user.location = location;
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};