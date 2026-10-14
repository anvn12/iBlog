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


module.exports = {
    getAllUsers,
    getUserByUsername,
    createNewUser
}