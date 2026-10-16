const express = require('express')
const router = express.Router()


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