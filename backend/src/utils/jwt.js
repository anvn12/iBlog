require('dotenv').config()
const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.SECRET_KEY

function signJWTToken(user) {
    if (!SECRET_KEY) {
        throw new Error('SECRET_KEY environment variable is not defined')
    }

    const token = jwt.sign(
        { // Payload
            user: {
                id: user.id,
                username: user.username
            }
        },
        SECRET_KEY,
        { expiresIn: '7d' }
    )

    return token
}


module.exports = {
    signJWTToken
}