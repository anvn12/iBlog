const express = require('express')
const router = express.Router()


// Log in
router.post('/login', (req, res) => {
    res.json({
        message: "This is log in"
    })
})


// Sign up
router.post('/signup', (req, res) => {
    res.json({
        message: "This is sign up"
    })
})


// Log out
router.post('/logout', (req, res) => {
    res.json({
        message: "This is log out"
    })
})


module.exports = router