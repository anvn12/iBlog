const passport = require('../config/passport')
const db = require('../services/db')
const { signJWTToken } = require('../utils/jwt')


function postLogin(req, res, next) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err)
        if (!user) {
            return res.status(401).json({ error: info?.message || 'Authentication failed' })
        }

        // Log in match -> return token -> client stores it to localStorage

        // Sign JWT
        const token = signJWTToken(user)

        res.json({
            message: 'Log in successful',
            token: token
        })
    })(req, res, next)
}


async function postSignup(req, res, next) {
    try {
        // Get info from form body
        const username = req.body.username
        const password = req.body.password

        // check if username exists
        const existingUser = await db.getUserByUsername(username)
        if (existingUser) {
            return res.status(409).json({
                error: 'Username already exists'
            })
        }

        // Hash password
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // Create new user in db 
        const newUser = await db.createNewUser(username, hashedPassword)
        const token = signJWTToken(newUser)

        res.status(201).json({
            message: 'created new user',
            token: token
        })
    } catch (err) {
        next(err)
    }
}


module.exports = {
    postLogin,
    postSignup
}