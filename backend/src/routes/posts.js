const express = require('express')
const router = express.Router()


router.get('/posts', (req, res) => {
    res.json({
        message: "This is get posts"
    })
})

router.post('/posts', (req, res) => {
    res.json({
        message: "This is post posts"
    })
})


// ID 
router.get('/posts/:id', (req, res) => {
    res.json({
        message: "This is get posts id"
    })
})

router.put('/posts/:id', (req, res) => {
    res.json({
        message: "This is put posts id"
    })
})

router.delete('/posts/:id', (req, res) => {
    res.json({
        message: "This is delete posts id"
    })
})


module.exports = router