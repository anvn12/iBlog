const express = require('express')
const router = express.Router()


<<<<<<< HEAD
router.get('/', (req, res) => {
=======
router.get('/posts', (req, res) => {
>>>>>>> 36590ae6e40a5277bac872428b088de549e29a78
    res.json({
        message: "This is get posts"
    })
})

<<<<<<< HEAD
router.post('/', (req, res) => {
=======
router.post('/posts', (req, res) => {
>>>>>>> 36590ae6e40a5277bac872428b088de549e29a78
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