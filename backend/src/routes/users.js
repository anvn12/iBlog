const express = require('express')
const router = express.Router()

const { authenticateToken } = require('../utils/jwt')
const usersController = require('../controllers/users')


// me (pass jwt)
router.get('/me', usersController.getUserFromJWT)


// ID 
router.get('/:id', authenticateToken, usersController.getUserProfile)
router.put('/:id', authenticateToken, usersController.updateUserProfile)


// User posts
router.get('/:id/posts', authenticateToken, usersController.getUserPosts)


module.exports = router