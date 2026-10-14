const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth')


router.post('/login', authController.postLogin)
router.post('/signup', authController.postSignup)

// Log out: client remove JWT on client (server not do anything)


module.exports = router