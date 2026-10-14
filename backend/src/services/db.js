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
async function getAllPosts(published = true) {
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
            }
        })

        return posts
    } catch (err) {
        throw err
    }
}


module.exports = {
    getAllUsers,
    getUserByUsername,
    createNewUser,

    getAllPosts
}