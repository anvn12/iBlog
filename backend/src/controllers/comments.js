const db = require('../services/db')


// Add a new comment
async function postComments(req, res, next) {
    try {
        const postId = req.params.postId

        // Post not found -> content not found (404) handler
        const post = await db.getPostById(postId)
        if (!post) { return next() }

        const content = req.body.content
        const authorId = req.user.user.id // req.user is decoded from the JWT

        // Create new comment in db 
        const newComment = await db.createNewComment(content, postId, authorId)

        res.status(201).json({
            message: 'created new Comment',
            comment: newComment
        })
    } catch (err) {
        next(err)
    }
}


// update
async function putComments(req, res, next) {
    try {
        // Post not found -> content not found (404) handler
        const postId = req.params.postId
        const post = await db.getPostById(postId)
        if (!post) { return next() }

        // verify if current user is the comment author
        const currentUser = req.user.user
        if (currentUser.id !== post.authorId) {
            return res.status(401).json({
                error: 'User is not the comment author'
            })
        }

        const commentId = req.params.commentId
        const newData = {
            content: req.body.content
        }

        // update comment in db
        const newComment = await db.updateComment(commentId, newData)

        res.status(201).json({
            message: 'update comment',
            comment: newComment
        })
    } catch (err) {
        next(err)
    }
}

// delete
async function deleteComments(req, res, next) {
    try {
        // Post not found -> content not found (404) handler
        const postId = req.params.postId
        const post = await db.getPostById(postId)
        if (!post) { return next() }

        // verify if current user is the comment author
        const currentUser = req.user.user
        if (currentUser.id !== post.authorId) {
            return res.status(401).json({
                error: 'User is not the comment author'
            })
        }

        // Delete comment in db 
        const commentId = req.params.commentId
        const deletedComment = await db.deleteComment(commentId)

        res.status(201).json({
            message: 'delete post',
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