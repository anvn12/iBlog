const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../utils/jwt");
const postsController = require("../controllers/posts");
const commentsController = require("../controllers/comments");

// /posts
router.get("/", postsController.getPosts);
router.post("/", authenticateToken, postsController.createPost);

// /posts/:id
router.get("/:id", postsController.getPost);
router.put("/:id", authenticateToken, postsController.updatePost);
router.delete("/:id", authenticateToken, postsController.deletePost);

// comments
router.post(
	"/:postId/comments",
	authenticateToken,
	commentsController.createComment
);
router.put(
	"/:postId/comments/:commentId",
	authenticateToken,
	commentsController.updateComment
);
router.delete(
	"/:postId/comments/:commentId",
	authenticateToken,
	commentsController.deleteComment
);

module.exports = router;
