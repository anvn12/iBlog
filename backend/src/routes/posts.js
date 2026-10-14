const express = require('express')
const router = express.Router()

const { authenticateToken } = require('../utils/jwt')

const postsController = require('../controllers/posts')

router.get('/', postsController.getPosts)

router.post('/', authenticateToken, postsController.postPosts)


// ID 
router.get('/:id', (req, res) => {
    res.json({
        message: "This is get posts id"
    })
})

router.put('/:id', authenticateToken, (req, res) => {
    res.json({
        message: "This is put posts id"
    })
})

router.delete('/:id', authenticateToken, (req, res) => {
    res.json({
        message: "This is delete posts id"
    })
})


module.exports = router