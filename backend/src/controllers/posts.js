const db = require('../services/db')

async function getPosts(req, res, next) {
    try {
        const posts = await db.getAllPosts() // default: published = true

        res.json({
            message: "This is get posts",
            posts
        })
    } catch (err) {
        next(err)
    }
}


async function postSignup(req, res, next) {
    try {
        // Get info from form body
        const username = req.body.username
        const password = req.body.password

        // check if username exists
        const existingUser = await db.getUserByUsername(username)
        if (existingUser) {
            return res.status(409).json({
                error: 'Username already exists'
            })
        }

        // Create new post in db 

        res.status(201).json({
            message: 'created new post'
        })
    } catch (err) {
        next(err)
    }
}


module.exports = {
    getPosts
}