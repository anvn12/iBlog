const db = require('../services/db')


// update
async function getUsersId(req, res, next) {
    try {
        // user not found -> content not found (404) handler
        const userId = req.params.id
        const user = await db.getUserById(userId)
        if (!user) { return next() }

        res.status(201).json({
            message: 'get user details',
            user: user
        })
    } catch (err) {
        next(err)
    }
}

// update
async function putUsersId(req, res, next) {
    try {
        // user not found -> content not found (404) handler
        const userId = req.params.id
        const user = await db.getUserById(userId)
        if (!user) { return next() }

        // verify if current user is the User author
        const currentUser = req.user.user
        if (currentUser.id !== user.id) {
            return res.status(401).json({
                error: 'User is not authorized'
            })
        }

        const newData = {
            name: req.body.name,
            email: req.body.email
        }

        // update User in db
        const newUser = await db.updateUser(userId, newData)

        res.status(201).json({
            message: 'update User',
            user: newUser
        })
    } catch (err) {
        next(err)
    }
}


async function getUserPosts(req, res, next) {
    try {
        // user not found -> content not found (404) handler
        const userId = req.params.id
        const user = await db.getUserById(userId)
        if (!user) { return next() }

        const published = (req.query.published && req.query.published === 'false') ? false : true
        if (published === false) {
            // verify if current user is the target user
            const currentUser = req.user.user
            if (currentUser.id !== user.id) {
                return res.status(401).json({
                    error: 'User is not authorized'
                })
            }
        }

        // update User in db
        const posts = await db.getPostsByUserId(userId, published)

        res.status(201).json({
            message: 'user posts',
            posts: posts
        })
    } catch (err) {
        next(err)
    }
}



module.exports = {
    getUsersId,
    putUsersId,

    getUserPosts
}