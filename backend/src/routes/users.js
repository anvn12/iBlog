const express = require('express')
const router = express.Router()

const { authenticateToken } = require('../utils/jwt')
const usersController = require('../controllers/users')


// ID 
router.get('/:id', authenticateToken, usersController.getUsersId)
router.put('/:id', authenticateToken, usersController.putUsersId)


// User posts
router.get('/:id/posts', (req, res) => {
    // query: published = true / false
    res.json({
        message: "This is get users id"
    })
})


module.exports = router