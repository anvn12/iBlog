const express = require('express')
const router = express.Router()


<<<<<<< HEAD
// All comments
router.get('/', (req, res) => {
=======
router.get('/comments', (req, res) => {
>>>>>>> 36590ae6e40a5277bac872428b088de549e29a78
    res.json({
        message: "This is get comments"
    })
})

<<<<<<< HEAD
router.post('/', (req, res) => {
=======
router.post('/comments', (req, res) => {
>>>>>>> 36590ae6e40a5277bac872428b088de549e29a78
    res.json({
        message: "This is post comments"
    })
})


// ID 
router.get('/:id', (req, res) => {
    res.json({
        message: "This is get comments id"
    })
})

router.put('/:id', (req, res) => {
    res.json({
        message: "This is put comments id"
    })
})

router.delete('/:id', (req, res) => {
    res.json({
        message: "This is delete comments id"
    })
})


module.exports = router