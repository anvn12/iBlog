const prisma = require('../lib/prisma.js')

async function getAllUsers() {
    return await prisma.user.findMany({
        omit: {
            password: true,
        },
        orderBy: {
            username: 'desc'
        }
    })
}

async function getUserByUsername(username) {
    return await prisma.user.findUnique({
        omit: {
            password: true,
        },
        where: { username: username }
    })
}

async function getUserById(id) {
    return await prisma.user.findUnique({
        omit: {
            password: true,
        },
        where: { id }
    })
}

async function createNewUser(username, password) {
    return await prisma.user.create({
        data: {
            username,
            password,
        },
        omit: {
            password: true,
        },
    })
}

async function updateUser(id, newData) {
    return await prisma.user.update({
        where: { id },
        data: newData,
        omit: {
            password: true,
        }
    })
}


// Posts
async function getAllPosts(published = true, orderBy = { updatedAt: "desc" }) {
    // default sort by updated time
    return await prisma.post.findMany({
        select: {
            id: true,
            title: true,
            updatedAt: true,
            author: {
                select: {
                    id: true,
                    username: true
                }
            }
        },
        where: {
            published
        },
        orderBy: orderBy
    })
}

async function getPostById(id, commentOrderBy = { updatedAt: "desc" }) {
    return await prisma.post.findUnique({
        include: {
            author: {
                select: {
                    id: true,
                    username: true
                }
            },
            comments: {
                select: {
                    id: true,
                    content: true,
                    updatedAt: true,
                    author: {
                        select: {
                            id: true,
                            username: true
                        }
                    }
                },
                orderBy: commentOrderBy
            }
        },
        where: { id }
    })
}

async function getPostsByUserId(userId, published = true, orderBy = { updatedAt: "desc" }) {
    return await prisma.post.findMany({
        where: {
            authorId: userId,
            published
        },
        orderBy
    })
}

async function createNewPost(title, content = null, published = false, authorId) {
    return await prisma.post.create({
        data: {
            title,
            content,
            published,
            authorId
        }
    })
}

async function updatePost(id, newData) {
    return await prisma.post.update({
        where: { id },
        data: newData,
    })
}

async function deletePost(id) {
    return await prisma.post.delete({
        where: { id }
    })
}


// Comments
async function getCommentById(id) {
    return await prisma.comment.findUnique({
        where: { id }
    })
}

async function createNewComment(content, postId, authorId) {
    return await prisma.comment.create({
        data: {
            content,
            postId,
            authorId
        }
    })
}

async function updateComment(id, newData) {
    return await prisma.comment.update({
        where: { id },
        data: newData,
    })
}

async function deleteComment(id) {
    return await prisma.comment.delete({
        where: { id }
    })
}


module.exports = {
    getAllUsers,
    getUserByUsername,
    getUserById,
    createNewUser,

    getAllPosts,
    getPostById,
    getPostsByUserId,
    createNewPost,
    updatePost,
    deletePost,

    getCommentById,
    createNewComment,
    updateComment,
    deleteComment,

    updateUser
}