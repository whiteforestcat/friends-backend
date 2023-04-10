import express from "express";
import { getFeedPosts, getUserPosts, likePosts } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Read data
router.get("/", verifyToken, getFeedPosts); // homepage posts
router.get("/:userId/posts", verifyToken, getUserPosts); // posts by user

// Update
router.patch("/:id/like", verifyToken, likePosts);

export default router;
