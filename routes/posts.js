import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Read data
router.get("/", verifyToken, getFeedPosts); // homepage posts, this will be localhost/posts/ due to addition in index.js
router.get("/:userId/posts", verifyToken, getUserPosts); // posts by user

// Update
router.patch("/:id/like", verifyToken, likePost);

export default router;
