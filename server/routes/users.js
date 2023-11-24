import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,

  getUserProfile,
  getFollowers,
  getFollowing,
  getUsersBySearch,
  getUsersToFollow,
  getUsersYouMightLike,
  followUnfollowUser,
  updateUser,
  deleteUser,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
//router.get("/:id", verifyToken, getUser);
//router.get("/:id", getUser);
router.get("/:id", getUserProfile);

//router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/:id/followers", getFollowers);
router.get("/:id/following", getFollowing);

router.post("/search", getUsersBySearch);

router.get("/:id/usersToFollow", getUsersToFollow);
router.get("/:id/:userId/usersYouMightLike", getUsersYouMightLike);

/* DELETE */
router.delete("/:id/deleteUser", deleteUser);

/* UPDATE */
//router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
//router.patch("/:id/:friendId", addRemoveFriend);

router.patch("/:id/updateUser", updateUser);
router.patch("/:id/:userId", followUnfollowUser);

export default router;