const prisma = require('../lib/prisma.js')

async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                username: 'desc'
            }
        })
        return users
    } catch (error) {
        throw error
    }
}

async function getUserByUsername(username) {
    try {
        const user = await prisma.user.findUnique({
            where: { username: username }
        })
        return user
    } catch (error) {
        throw error
    }
}

async function getUserById(id) {
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        })
        return user
    } catch (error) {
        throw error
    }
}

async function createNewUser(username, password) {
    try {
        const user = await prisma.user.create({
            data: {
                username,
                password,
            },
        })
        return user
    } catch (error) {
        throw error
    }
}


// Posts
async function getAllPosts(published = true, orderBy = { updatedAt: "desc" }) {
    // default sort by updated time
    try {
        const posts = await prisma.post.findMany({
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

        return posts
    } catch (err) {
        throw err
    }
}

async function getPostById(id, commentOrderBy = { updatedAt: "desc" }) {
    try {
        const post = await prisma.post.findUnique({
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

        return post
    } catch (error) {
        throw error
    }
}

async function createNewPost(title, content = null, published = false, authorId) {
    try {
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                published,
                authorId
            }
        })

        return newPost
    } catch (err) {
        throw err
    }
}

async function updatePost(id, newData) {
    const updatedPost = await prisma.post.update({
        where: { id },
        data: newData,
    });

    return updatedPost
}

async function deletePost(id) {
    const updatedPost = await prisma.post.delete({
        where: { id }
    });

    return updatedPost
}


// Comments
async function createNewComment(content, postId, authorId) {
    try {
        const newComment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId
            }
        })

        return newComment
    } catch (err) {
        throw err
    }
}

async function updateComment(id, newData) {
    const updatedComment = await prisma.comment.update({
        where: { id },
        data: newData,
    });

    return updatedComment
}

async function deleteComment(id) {
    const updatedComment = await prisma.comment.delete({
        where: { id }
    });

    return updatedComment
}


// User 
async function updateUser(id, newData) {
    const updatedUser = await prisma.user.update({
        where: { id },
        data: newData,
    });
    return updatedUser
}

module.exports = {
    getAllUsers,
    getUserByUsername,
    getUserById,
    createNewUser,

    getAllPosts,
    getPostById,
    createNewPost,
    updatePost,
    deletePost,

    createNewComment,
    updateComment,
    deleteComment,

    updateUser
}