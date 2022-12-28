// backend/routes/api/users.js
const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateSignup = [
	check("email", "email: Please provide a valid email.")
		.exists({ checkFalsy: true })
		.bail()
		.isEmail(),
	check("username", "username: Please provide a username with at least 4 characters.")
		.exists({ checkFalsy: true })
		.bail()
		.isLength({ min: 4 }),
	check("username", "username: Username cannot be an email.").not().bail().isEmail(),
	check("password", "Password: Password must be 6 characters or more.")
		.exists({ checkFalsy: true })
		.bail()
		.isLength({ min: 6 }),
		check("firstName", "firstName: First Name is required")
		.exists({ checkFalsy: true }),
		check("lastName", "lastName: Last Name is required")
		.exists({ checkFalsy: true }),
	handleValidationErrors,
];

router.post("/", validateSignup, async (req, res) => {
	const { email, password, username, firstName, lastName } = req.body;
	
	const usernameCheck = await User.findOne({
		where: {
			username: username
		}
	})
	
	if (usernameCheck) {
		res.status(403);
		res.statusCode = 403;
		return res.json({
			message: "User already exists",
			StatusCode: res.statusCode,
			errors: "User with that username already exists"
		});
	}
	
	const emailCheck = await User.findOne({
		where: {
			email: email
		}
	})
	
	if (emailCheck) {
		res.status(403);
		res.statusCode = 403;
		return res.json({
			message: "User already exists",
			StatusCode: res.statusCode,
			errors: "User with that email already exists"
		});
	}
	
	const user = await User.signup({ email, username, password, firstName, lastName });
	
	await setTokenCookie(res, user);
	
	return res.json({
		id:user.id,
		firstName:firstName,
		lastName:lastName,
		email:email,
		username:username,
		token:req.cookies.token
	});
});

module.exports = router;
