const bcrypt = require('bcrypt')
const passport = require('../config/passport')
const db = require('../services/db')
const { signJWTToken } = require('../utils/jwt')
const { body, validationResult } = require('express-validator')


// Login
const loginValidator = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required'),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),
]
const postLogin = [
    loginValidator,
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err) return next(err)
            if (!user) {
                return res.status(401).json({ error: info?.message || 'Authentication failed' })
            }

            // Log in match -> return token -> client stores it to localStorage

            // Sign JWT
            const token = signJWTToken(user)

            res.json({
                message: 'Log in successfully',
                token: token
            })
        })(req, res, next)
    }
]


// Signup
const signupValidator = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores')
        .custom(async (username) => {
            const user = await db.getUserByUsername(username.trim())
            if (user) {
                throw new Error('Username already exists')
            }
        }),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    body('confirmPassword')
        .notEmpty()
        .withMessage('Confirm password is required')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Confirm password must match')
]
const postSignup = [
    signupValidator,
    async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            // Get info from form body
            const username = req.body.username.trim()
            const password = req.body.password

            // Hash password
            const saltRounds = 12
            const hashedPassword = await bcrypt.hash(password, saltRounds)

            // Create new user in db 
            const newUser = await db.createNewUser(username, hashedPassword)
            const token = signJWTToken(newUser)

            res.status(201).json({
                message: 'Sign up successfully',
                token: token
            })
        } catch (err) {
            next(err)
        }
    }
]


module.exports = {
    postLogin,
    postSignup
}