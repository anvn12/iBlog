const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    res.json({
        message: "This is get posts"
    })
})

router.post('/', (req, res) => {
    res.json({
        message: "This is post posts"
    })
})


// ID 
router.get('/:id', (req, res) => {
    res.json({
        message: "This is get posts id"
    })
})

router.put('/:id', (req, res) => {
    res.json({
        message: "This is put posts id"
    })
})

router.delete('/:id', (req, res) => {
    res.json({
        message: "This is delete posts id"
    })
})


module.exports = router