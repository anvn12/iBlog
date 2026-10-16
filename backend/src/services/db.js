const { AnyNull, AnyNullClass } = require('../../generated/prisma/runtime/client.js')
const prisma = require('../lib/prisma.js')

async function getAllUsers() {
    try {
        const users = await prisma.user.findMany()
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

async function getPostById(id) {
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
                    }
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

module.exports = {
    getAllUsers,
    getUserByUsername,
    createNewUser,

    getAllPosts,
    getPostById,
    createNewPost,
    updatePost
}