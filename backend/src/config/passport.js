const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')


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

module.exports = passport