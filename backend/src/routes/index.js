const express = require("express");
const router = express.Router();

// Log in
router.get("/", (req, res) => {
	res.json({
		message: "This is home",
	});
});

module.exports = router;
