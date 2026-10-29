const request = require("supertest");
const express = require("express");
const app = express();

const index = require("../src/routes/index");

app.use(express.urlencoded({ extended: false }));
app.use("/", index);

describe("Index / Healthcheck Routes", () => {
	test("GET / should return 200 and greeting message", done => {
		request(app)
			.get("/")
			.expect(200)
			.expect("Content-Type", /json/)
			.expect({ message: "This is home" }, done);
	});
});	
