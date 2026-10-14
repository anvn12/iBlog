const db = require('../services/db')


// Posts
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

async function postPosts(req, res, next) {
    try {
        // Get info from form body
        const title = req.body.title
        const content = req.body.content || null
        const published = req.body.published || false
        const authorId = req.user.user.id // req.user is decoded from the JWT

        // Create new post in db 
        const newPost = await db.createNewPost(title, content, published, authorId)

        res.status(201).json({
            message: 'created new post',
            post: newPost
        })
    } catch (err) {
        next(err)
    }
}


module.exports = {
    getPosts,
    postPosts
}