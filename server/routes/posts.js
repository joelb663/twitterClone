import express from "express";
import { 
    getFeedPosts, 
    getUserPosts,
    createPost,
    likeUnlikePost,
    updatePost,
    deletePost,
    createReply,
    getPostsLikedByUser,
    getRepliesByUser
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);

router.get("/:userId/posts", verifyToken, getUserPosts);

router.get("/:userId/postsByLikes", verifyToken, getPostsLikedByUser);

router.get("/:userId/replies", verifyToken, getRepliesByUser);

/* CREATE */
router.post("/createPost", verifyToken, createPost);

router.post("/:id/reply", verifyToken, createReply)

/* UPDATE */
router.patch("/:id/like", verifyToken, likeUnlikePost);

router.patch("/:id/updatePost", verifyToken, updatePost);

/* DELETE */
router.delete("/:id/deletePost", verifyToken, deletePost);

export default router;