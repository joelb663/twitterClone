import User from "../models/User.js";
import UserAccount from "../models/UserAccount.js";
import UserProfile from "../models/UserProfile.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      );
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return { _id, firstName, lastName, occupation, location, picturePath };
        }
      );
      res.status(200).json(formattedFriends);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

  /* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
      const { id, friendId } = req.params;
      const user = await User.findById(id);
      const friend = await User.findById(friendId);
  
      if (user.friends.includes(friendId)) {
        user.friends = user.friends.filter((id) => id !== friendId);
        friend.friends = friend.friends.filter((id) => id !== id);
      } else {
        user.friends.push(friendId);
        friend.friends.push(id);
      }
      await user.save();
      await friend.save();
  
      const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      );
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return { _id, firstName, lastName, occupation, location, picturePath };
        }
      );
      res.status(200).json(formattedFriends);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

  //my code down here

  /* READ */
  export const getUserProfile = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserProfile.findById(id);
      res.status(200).json(user);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

  export const getFollowers = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserProfile.findById(id);
      
      const followers = await Promise.all(
        user.followers.map((id) => UserProfile.findById(id))
      ); 
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

  export const getFollowing = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserProfile.findById(id);
  
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

export const getUsersBySearch = async (req, res) => {
  try {
    const { searchQuery } = req.body;
    const usersFound = await UserProfile.find({name: {$regex: searchQuery, $options: 'i'}});

    const formattedUsersFound = usersFound.map(
      ({ _id, name, profilePicturePath }) => {
        return { _id, name, profilePicturePath };
      }
    );
    res.status(200).json(formattedUsersFound);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export const getUsersToFollow = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await UserProfile.aggregate( [ { $sample: { size: 3 } } ] );

    const usersToFollow = []
    users.forEach((user) => {
      if (!user.followers.includes(id) && JSON.stringify(user._id) !== JSON.stringify(id)) {
        usersToFollow.push(user);
      } 
    });
    const formattedUsersToFollow = usersToFollow.map(
      ({ _id, name, profilePicturePath }) => {
        return { _id, name, profilePicturePath };
      }
    );
    res.status(200).json(formattedUsersToFollow);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUsersYouMightLike = async (req,res) => {
  try {
    const { id, userId } = req.params;
    const user = await UserProfile.findById(userId);

    const userFollowers = await Promise.all(
      user.followers.map((id) => UserProfile.findById(id))
    );

    const usersYouMightLike = []
    userFollowers.forEach((user) => {
      if (!user.followers.includes(id) && JSON.stringify(user._id) !== JSON.stringify(id)) {
        usersYouMightLike.push(user);
      } 
    });
    const formattedUsersYouMightLike = usersYouMightLike.map(
      ({ _id, name, profilePicturePath }) => {
        return { _id, name, profilePicturePath };
      }
    );
    res.status(200).json(formattedUsersYouMightLike);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

/* UPDATE */
export const followUnfollowUser = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const user = await UserProfile.findById(id);
    const user2 = await UserProfile.findById(userId);

    if (user.following.includes(userId)) {
      user.following = user.following.filter((id) => id !== userId);
      user2.followers = user2.followers.filter((id) => id !== id);
    } else {
      user.following.push(userId);
      user2.followers.push(id);
    }
    await user.save();
    await user2.save();

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
    } = req.body;

    user.name = name;
    user.gender = gender;
    user.birthDate = birthDate;
    user.bio = bio;
    user.profilePicturePath = profilePicturePath;
    user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// works in most cases need more testing

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserProfile.findById(id);
     
    async function filterFollowing(value){
      const user = await UserProfile.findById(value);

      const index = user.following.indexOf(id);
      if (index > -1)
        user.following.splice(index, 1);
      user.save();
    }
    async function filterFollowers(value){
      const user = await UserProfile.findById(value);

      const index = user.followers.indexOf(id);
      if (index > -1)
        user.followers.splice(index, 1);
      user.save();
    }

    await Promise.all(
      user.following.map( async (userId) => {
        await filterFollowers(userId)
      })
    );
    await Promise.all(
      user.followers.map( async (userId) => {
        await filterFollowing(userId)
      })
    );

    const userProfileDeleted = await UserProfile.findByIdAndDelete(id);
    res.status(200).json(userProfileDeleted);
    //console.log(id);

    //res.status(200).json("testing");

    // GRAB THE JWT TOKEN
    // PARSE THE TOKEN TO GET THE ID
    // userAccountDeleted = await UserAccount.findByIdAndDelete(id)
    //let token = req.header("Authorization");

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};