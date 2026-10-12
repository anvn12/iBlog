const express = require('express')
const router = express.Router()


// All comments
router.get('/', (req, res) => {
    res.json({
        message: "This is get comments"
    })
})

router.post('/', (req, res) => {
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