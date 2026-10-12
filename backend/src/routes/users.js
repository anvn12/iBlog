const express = require('express')
const router = express.Router()


router.get('/users', (req, res) => {
    res.json({
        message: "This is get users"
    })
})


// ID 
router.get('/users/:id', (req, res) => {
    res.json({
        message: "This is get users id"
    })
})

router.put('/users/:id', (req, res) => {
    res.json({
        message: "This is put users id"
    })
})

router.delete('/users/:id', (req, res) => {
    res.json({
        message: "This is delete users id"
    })
})


// User posts
router.get('/users/:id/posts', (req, res) => {
    // query: published = true / false
    res.json({
        message: "This is get users id"
    })
})


module.exports = router