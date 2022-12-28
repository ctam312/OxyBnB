// backend/routes/api/session.js
const express = require("express");

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateLogin = [
	check("credential", "credential: Please provide a valid email or username." )
		.exists({ checkFalsy: true })
		.bail()
		.notEmpty(),
	check("password", "password: Please provide a password.")
		.exists({ checkFalsy: true }),
	handleValidationErrors,
];

// backend/routes/api/session.js
// ...


// Log in
router.post("/", validateLogin, async (req, res, next) => {
	const { credential, password } = req.body;

	const user = await User.login({ credential, password });

	if (!user) {
		const err = new Error("Login failed");
		err.status = 401;
		err.title = "Login failed";
		err.errors = ["The provided credentials were invalid."];
		return next(err);
	}

	await setTokenCookie(res, user);

	return res.json({
		id: user.id,
		firstname: user.firstName,
		lastname: user.lastName,
		email: user.email,
		username: user.username
	});
});











router.delete("/", (_req, res) => {
	res.clearCookie("token");
	return res.json({ message: "success" });
});

router.get("/", restoreUser, (req, res) => {
	const { user } = req;
	if (user) {
		return res.json({
			user: user.toSafeObject(),
		});
	} else return res.json({ user: null });
});

module.exports = router;
