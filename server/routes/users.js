import express from "express";
import {
  getUserProfile,
  getFollowers,
  getFollowing,
  getUsersBySearch,
  getUsersToFollow,
  getUsersYouMightLike,
  followUnfollowUser,
  updateUser,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUserProfile);

router.get("/:id/followers", verifyToken, getFollowers);

router.get("/:id/following", verifyToken, getFollowing);

router.post("/search", verifyToken, getUsersBySearch);

router.get("/:id/usersToFollow", verifyToken, getUsersToFollow);

router.get("/:id/usersYouMightLike", verifyToken, getUsersYouMightLike);

/* UPDATE */
router.patch("/:id/updateUser", verifyToken, updateUser);

router.patch("/:id/:userId", verifyToken, followUnfollowUser);

export default router;