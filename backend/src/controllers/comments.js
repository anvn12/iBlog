const db = require('../services/db')
const { body, validationResult } = require('express-validator')

// Add a new comment
const postCommentsValidator = [
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content must not be empty'),
]
const postComments = [
    postCommentsValidator,
    async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const postId = req.params.postId

            // Post not found -> content not found (404) handler
            const post = await db.getPostById(postId)
            if (!post) { return next() }

            const content = req.body.content.trim()
            const authorId = req.user.user.id // req.user is decoded from the JWT

            // Create new comment in db 
            const newComment = await db.createNewComment(content, postId, authorId)

            res.status(201).json({
                message: 'Create new comment sucessfully',
                comment: newComment
            })
        } catch (err) {
            next(err)
        }
    }
]


// update
const putComments = [
    postCommentsValidator,
    async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            // Post not found -> content not found (404) handler
            const postId = req.params.postId
            const post = await db.getPostById(postId)
            if (!post) { return next() }

            const commentId = req.params.commentId
            const comment = await db.getCommentById(commentId)
            if (!comment) { return next() }

            // verify if current user is the comment author
            const currentUser = req.user.user
            if (currentUser.id !== comment.authorId) {
                return res.status(403).json({
                    error: 'User is not the comment author'
                })
            }

            const newData = {
                content: req.body.content.trim()
            }

            // update comment in db
            const newComment = await db.updateComment(commentId, newData)

            res.status(200).json({
                message: 'Update comment sucessfully',
                comment: newComment
            })
        } catch (err) {
            next(err)
        }
    }
]

// delete
async function deleteComments(req, res, next) {
    try {
        // Post not found -> content not found (404) handler
        const postId = req.params.postId
        const post = await db.getPostById(postId)
        if (!post) { return next() }

        const commentId = req.params.commentId
        const comment = await db.getCommentById(commentId)
        if (!comment) { return next() }

        // verify if current user is the comment author
        const currentUser = req.user.user
        if (currentUser.id !== comment.authorId) {
            return res.status(403).json({
                error: 'User is not the comment author'
            })
        }

        // Delete comment in db 
        const deletedComment = await db.deleteComment(commentId)

        res.status(200).json({
            message: 'Delete comment sucessfully',
            comment: deletedComment
        })
    } catch (err) {
        next(err)
    }
}


module.exports = {
    postComments,
    putComments,
    deleteComments
}