require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = process.env.FRONTEND_URL
	? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim())
	: "*";

app.use(
	cors({
		origin: allowedOrigins === "*" ? "*" : allowedOrigins,
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);

// Not found handler (404)
app.use((req, res, next) => {
	res.status(404).json({ error: "Endpoint not found" });
});

// Error handler (500)
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, (err) => {
	if (err) {
		console.error(err);
		return;
	}
	console.log(`Server is running on http://localhost:${PORT}`);
});
