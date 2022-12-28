// backend/utils/validation.js
const { validationResult } = require("express-validator");

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, res, next) => {
	const validationErrors = validationResult(req);

	if (!validationErrors.isEmpty()) {
		const errors = validationErrors.array().map((error) => `${error.msg}`);

		const err = Error("Bad request.");
		err.errors = errors;
		err.status = 400;
		err.title = "Bad request.";
		res.status(400);
		return res.json({
			message: "Validation error",
			statusCode: 400,
			errors: err.errors
		})
		next(err);
	}
	next();
};

module.exports = {
	handleValidationErrors,
};
