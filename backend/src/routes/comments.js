const express = require('express')
const router = express.Router()


router.get('/comments', (req, res) => {
    res.json({
        message: "This is get comments"
    })
})

router.post('/comments', (req, res) => {
    res.json({
        message: "This is post comments"
    })
})


// ID 
router.get('/comments/:id', (req, res) => {
    res.json({
        message: "This is get comments id"
    })
})

router.put('/comments/:id', (req, res) => {
    res.json({
        message: "This is put comments id"
    })
})

router.delete('/comments/:id', (req, res) => {
    res.json({
        message: "This is delete comments id"
    })
})


module.exports = router