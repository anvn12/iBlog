const request = require("supertest");
const app = require("../src/app");
const db = require("../src/services/db");

// Mock db service to isolate auth routes without requiring a live database connection
jest.mock("../src/services/db");

describe("Auth - Signup", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should return 400 when validation fails (missing fields)", async () => {
		const res = await request(app)
			.post("/auth/signup")
			.send({ username: "" });

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("errors");
		expect(Array.isArray(res.body.errors)).toBe(true);
	});

	it("should return 400 when passwords do not match", async () => {
		const res = await request(app)
			.post("/auth/signup")
			.send({
				username: "testuser",
				password: "password123",
				confirmPassword: "differentpassword",
			});

		expect(res.statusCode).toBe(400);
		expect(res.body.errors.some((err) => err.path === "confirmPassword")).toBe(true);
	});

	it("should return 201 and token on successful signup", async () => {
		db.getUserByUsername.mockResolvedValue(null);
		db.createNewUser.mockResolvedValue({
			id: "user-123",
			username: "newuser",
		});

		const res = await request(app)
			.post("/auth/signup")
			.send({
				username: "newuser",
				password: "password123",
				confirmPassword: "password123",
			});

		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty("message", "Signup successfully");
		expect(res.body).toHaveProperty("token");
	});
});

describe("Auth - Login", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should return 400 when username or password is missing", async () => {
		const res = await request(app)
			.post("/auth/login")
			.send({});

		expect(res.statusCode).toBe(400);
		expect(res.body).toHaveProperty("errors");
	});

	it("should return 401 when user credentials are invalid", async () => {
		const prisma = require("../src/lib/prisma");
		jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

		const res = await request(app)
			.post("/auth/login")
			.send({
				username: "nonexistentuser",
				password: "wrongpassword",
			});

		expect(res.statusCode).toBe(401);
		expect(res.body).toHaveProperty("error");
	});

	it("should return 200 and token on successful login", async () => {
		const bcrypt = require("bcrypt");
		const prisma = require("../src/lib/prisma");

		const hashedPassword = await bcrypt.hash("correctpassword", 10);
		jest.spyOn(prisma.user, "findUnique").mockResolvedValue({
			id: "user-123",
			username: "testuser",
			password: hashedPassword,
		});

		const res = await request(app)
			.post("/auth/login")
			.send({
				username: "testuser",
				password: "correctpassword",
			});

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("message", "Login successfully");
		expect(res.body).toHaveProperty("token");
	});
});
