require("dotenv").config();
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

function signJWTToken(user) {
	if (!SECRET_KEY) {
		throw new Error("SECRET_KEY environment variable is not defined");
	}

	const token = jwt.sign(
		{
			// Payload
			user: {
				id: user.id,
				username: user.username,
			},
		},
		SECRET_KEY,
		{ expiresIn: "7d" }
	);

	return token;
}

function authenticateToken(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({
			message: "Authentication token required",
		});
	}

	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		req.user = decoded;
		next();
	} catch {
		return res.status(401).json({
			message: "Invalid or expired token",
		});
	}
}

module.exports = {
	signJWTToken,
	authenticateToken,
};
