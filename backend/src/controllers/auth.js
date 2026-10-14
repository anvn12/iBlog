const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const db = require('../services/db')
const { signJWTToken } = require('../utils/jwt')


// Local strategy for login with username and password
passport.use(new LocalStrategy(async function verify(username, password, done) {
    try {
        const user = await db.getUserByUsername(username)

        // Not found username
        if (!user) { return done(null, false, { message: 'Incorrect username or password.' }) }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect username or password.' })
        }

        return done(null, user)
    } catch (err) {
        return done(err)
    }
}))


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