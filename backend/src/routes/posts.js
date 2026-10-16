const express = require('express')
const router = express.Router()

const { authenticateToken } = require('../utils/jwt')
const postsController = require('../controllers/posts')
const commentsController = require('../controllers/comments')


// /posts 
router.get('/', postsController.getPosts)
router.post('/', authenticateToken, postsController.postPosts)


// /posts/:id
router.get('/:id', postsController.getPostsId)
router.put('/:id', authenticateToken, postsController.putPostsId)
router.delete('/:id', authenticateToken, postsController.deletePostsId)


// comments
router.post('/:postId/comments', authenticateToken, commentsController.postComments)
router.put('/:postId/comments/:commentId', authenticateToken, commentsController.putComments)
router.delete('/:postId/comments/:commentId', authenticateToken, commentsController.deleteComments)


module.exports = router