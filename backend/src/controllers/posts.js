const db = require('../services/db')


// Posts
async function getPosts(req, res, next) {
    try {
        const posts = await db.getAllPosts() // default: published = true

        res.json({
            message: "get all posts",
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


// Post with Id
async function getPostsId(req, res, next) {
    try {
        const id = req.params.id
        const post = await db.getPostById(id)

        res.json({
            message: "get post details",
            post
        })
    } catch (err) {
        next(err)
    }
}

// update
async function putPostsId(req, res, next) {
    try {
        // verify if current user is the post author
        const postId = req.params.id
        const post = await db.getPostById(postId)

        const currentUser = req.user.user
        if (currentUser.id !== post.authorId) {
            return res.status(401).json({
                error: 'User is not the post author'
            })
        }

        // Get info from form body
        const newData = {
            title: req.body.title,
            content: req.body.content || null,
            published: (req.body.published === 'true') || false
        }

        // update post in db
        const updatedPost = await db.updatePost(postId, newData)

        res.status(201).json({
            message: 'update post',
            post: updatedPost
        })
    } catch (err) {
        next(err)
    }
}

// delete
async function deletePostsId(req, res, next) {
    try {
        // verify if current user is the post author
        const postId = req.params.id
        const post = await db.getPostById(postId)

        const currentUser = req.user.user
        if (currentUser.id !== post.authorId) {
            return res.status(401).json({
                error: 'User is not the post author'
            })
        }

        // Delete post in db 
        const deletedPost = await db.deletePost(postId)

        res.status(201).json({
            message: 'delete post',
            post: deletedPost
        })
    } catch (err) {
        next(err)
    }
}


module.exports = {
    getPosts,
    postPosts,

    getPostsId,
    putPostsId,
    deletePostsId
}