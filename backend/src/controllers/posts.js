const db = require('../services/db')
const { body, validationResult } = require('express-validator')


// Posts
async function getPosts(req, res, next) {
    try {
        const posts = await db.getAllPosts() // default: published = true

        res.json({
            message: "Get all posts",
            posts
        })
    } catch (err) {
        next(err)
    }
}

const postPostsValidator = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title must not be empty'),
]
const postPosts = [
    postPostsValidator,
    async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            // Get info from form body
            const title = req.body.title?.trim()
            const content = req.body.content?.trim() || null
            const published = req.body.published || false
            const authorId = req.user.user.id // req.user is decoded from the JWT

            // Create new post in db 
            const newPost = await db.createNewPost(title, content, published, authorId)

            res.status(201).json({
                message: 'Created new post successfully',
                post: newPost
            })
        } catch (err) {
            next(err)
        }
    }
]

// Post with Id
async function getPostsId(req, res, next) {
    try {
        const id = req.params.id
        const post = await db.getPostById(id)

        // Post not found -> content not found (404) handler
        if (!post) {
            return next()
        }

        res.json({
            message: "Get post details",
            post
        })
    } catch (err) {
        next(err)
    }
}

// update
const putPostsId = [
    postPostsValidator,
    async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const postId = req.params.id
            const post = await db.getPostById(postId)

            // Post not found -> content not found (404) handler
            if (!post) {
                return next()
            }

            // verify if current user is the post author
            const currentUser = req.user.user
            if (currentUser.id !== post.authorId) {
                return res.status(403).json({
                    error: 'User is not the post author'
                })
            }

            // Get info from form body
            const newData = {
                title: req.body.title?.trim(),
                content: req.body.content?.trim() || null,
                published: (req.body.published === 'true') || false
            }

            // update post in db
            const updatedPost = await db.updatePost(postId, newData)

            res.status(200).json({
                message: 'Updated post sucessfully',
                post: updatedPost
            })
        } catch (err) {
            next(err)
        }
    }
]


// delete
async function deletePostsId(req, res, next) {
    try {
        const postId = req.params.id
        const post = await db.getPostById(postId)

        // Post not found -> content not found (404) handler
        if (!post) {
            return next()
        }

        // verify if current user is the post author
        const currentUser = req.user.user
        if (currentUser.id !== post.authorId) {
            return res.status(403).json({
                error: 'User is not the post author'
            })
        }

        // Delete post in db 
        const deletedPost = await db.deletePost(postId)

        res.status(200).json({
            message: 'Deleted post sucessfully',
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