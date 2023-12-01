import express from "express";
import { 
    getFeedPosts, 
    getUserPosts,
    createPost,
    getPostsByTag,
    likeUnlikePost,
    getPostsByUsersFollowing,
    updatePost,
    deletePost,
    createReply
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
//router.get("/", verifyToken, getFeedPosts);
router.get("/", getFeedPosts);

//router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/:userId/posts", getUserPosts);

router.get("/:tag/postsByTag", getPostsByTag);

router.get("/:userId/postsByUsersFollowing", getPostsByUsersFollowing);

/* CREATE */
router.post("/createPost", createPost);

router.post("/:id/reply", createReply)

/* UPDATE */
//router.patch("/:id/like", verifyToken, likePost);
//router.patch("/:id/like", likePost);

router.patch("/:id/like", likeUnlikePost);

router.patch("/:id/updatePost", updatePost);

/* DELETE */
router.delete("/:id/deletePost", deletePost);

export default router;