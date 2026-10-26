require('dotenv').config()
const db = require('../services/db')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')

const SECRET_KEY = process.env.SECRET_KEY


// get user data from jwt
async function getUserFromJWT(req, res) {
    return res.json({
        message: 'Authenticated',
        payload: req.user
    })
}


// update
async function getUserProfile(req, res, next) {
    try {
        // user not found -> content not found (404) handler
        const userId = req.params.id
        const user = await db.getUserById(userId)
        if (!user) { return next() }

        res.status(200).json({
            message: 'Get user details',
            user: user
        })
    } catch (err) {
        next(err)
    }
}

// update
const userUpdateValidator = [
    body('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),

    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Name cannot be empty')
]
const updateUserProfile = [
    userUpdateValidator,
    async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            // user not found -> content not found (404) handler
            const userId = req.params.id
            const user = await db.getUserById(userId)
            if (!user) { return next() }

            // verify if current user is the User author
            const currentUser = req.user.user
            if (currentUser.id !== user.id) {
                return res.status(403).json({
                    error: 'User is not authorized to update this profile'
                })
            }

            const newData = {}
            if (req.body.name !== undefined) newData.name = req.body.name.trim()
            if (req.body.email !== undefined) newData.email = req.body.email.trim()


            // update User in db
            const newUser = await db.updateUser(userId, newData)

            res.status(200).json({
                message: 'Update user information successfully',
                user: newUser
            })
        } catch (err) {
            next(err)
        }
    }
]

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
                return res.status(403).json({
                    error: 'User is not authorized'
                })
            }
        }

        // update User in db
        const posts = await db.getPostsByUserId(userId, published)

        res.status(200).json({
            message: 'Get user posts successfully',
            posts: posts
        })
    } catch (err) {
        next(err)
    }
}



module.exports = {
    getUserFromJWT,
    getUserProfile,
    updateUserProfile,

    getUserPosts
}