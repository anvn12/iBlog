const express = require('express')
const router = express.Router()

const { authenticateToken } = require('../utils/jwt')
const postsController = require('../controllers/posts')


// /posts 
router.get('/', postsController.getPosts)
router.post('/', authenticateToken, postsController.postPosts)


// /posts/:id
router.get('/:id', postsController.getPostsId)
router.put('/:id', authenticateToken, postsController.putPostsId)
router.delete('/:id', authenticateToken, postsController.deletePostsId)


// Update & delete comment are in comments route: /comments/:id


module.exports = router