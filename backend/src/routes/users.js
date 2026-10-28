const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../utils/jwt");
const usersController = require("../controllers/users");
const getUserFromJWT = require("../middlewares/getUserFromJWT");

// me (pass jwt)
router.get("/me", getUserFromJWT, usersController.getUserFromJWT);

// ID
router.get("/:id", usersController.getUserProfile);
router.put("/:id", authenticateToken, usersController.updateUserProfile);

// User posts
router.get("/:id/posts", getUserFromJWT, usersController.getUserPosts);

module.exports = router;
