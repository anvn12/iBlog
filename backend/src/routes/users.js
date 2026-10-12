const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    res.json({
        message: "This is get users"
    })
})


// ID 
router.get('/:id', (req, res) => {
    res.json({
        message: "This is get users id"
    })
})

router.put('/:id', (req, res) => {
    res.json({
        message: "This is put users id"
    })
})

router.delete('/:id', (req, res) => {
    res.json({
        message: "This is delete users id"
    })
})


// User posts
router.get('/:id/posts', (req, res) => {
    // query: published = true / false
    res.json({
        message: "This is get users id"
    })
})


module.exports = router