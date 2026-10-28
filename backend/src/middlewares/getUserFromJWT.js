require("dotenv").config();
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

// get user data from jwt
async function getUserFromJWT(req, res, next) {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
	if (!token) {
		req.user = null;
		return next();
	}

	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		req.user = decoded;

		return next();
	} catch {
		req.user = null;
		return next();
	}
}

module.exports = getUserFromJWT;
