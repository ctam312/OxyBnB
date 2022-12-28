const express = require("express");

const {
	setTokenCookie,
	restoreUser,
	requireAuth,
} = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
	Spot,
	Review,
	SpotImage,
	ReviewImage,
	User,
	Booking,
} = require("../../db/models");

const { Op } = require("sequelize");

const router = express.Router();

const validateSpot = [
	check("address").notEmpty().withMessage("Street address is required"),
	check("city").notEmpty().withMessage("City is required"),
	check("state").notEmpty().withMessage("State is required"),
	check("country").notEmpty().withMessage("Country is required"),
	check("lat").notEmpty().isDecimal().withMessage("Latitude is not valid"),
	check("lng").notEmpty().isDecimal().withMessage("Longitude is not valid"),
	check("name")
		.notEmpty()
		.isLength({ min: 1, max: 50 })
		.withMessage("Name must be less than 50 characters"),
	check("description").notEmpty().withMessage("Description is required"),
	check("price").notEmpty().isFloat().withMessage("Price per day is required"),
	handleValidationErrors,
];

const validateSpotImage = [
	check("url").notEmpty().withMessage("URL is required"),
	check("preview")
		.notEmpty()
		.isBoolean()
		.withMessage("Must enter 'true' or 'false'"),
	handleValidationErrors,
];

const validateReview = [
	check("review").notEmpty().withMessage("Review text is required"),
	check("stars")
		.notEmpty()
		.isInt({ min: 1, max: 5 })
		.withMessage("Stars must be an integer from 1 to 5"),
	handleValidationErrors,
];

const validateBooking = [
	check("startDate").isDate().withMessage("startDate is not valid"),
	check("endDate").isDate().withMessage("endDate is not valid"),
	handleValidationErrors,
];

const validateQueries = [
	check("page")
		.optional()
		.isInt({ min: 1 })
		.withMessage("Page must be greater than or equal to 1"),
	check("size")
		.optional()
		.isInt({ min: 1 })
		.withMessage("Size must be greater than or equal to 1"),
	check("minLat")
		.optional()
		.isDecimal()
		.withMessage("Minimum latitude is invalid"),
	check("maxLat")
		.optional()
		.isDecimal()
		.withMessage("Maximum latitude is invalid"),
	check("minLng")
		.optional()
		.isDecimal()
		.withMessage("Minimum longitude is invalid"),
	check("maxLng")
		.optional()
		.isDecimal()
		.withMessage("Maximum longitude is invalid"),
	check("minPrice")
		.optional()
		.isFloat({ min: 0 })
		.withMessage("Minimum price must be greater than or equal to 0"),
	check("maxPrice")
		.optional()
		.isFloat({ min: 0 })
		.withMessage("Maximum price must be greater than or equal to 0"),
	handleValidationErrors,
];

//get all spots
router.get("/", validateQueries, async (req, res, next) => {
	let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
		req.query;

	let pagination = {};

	page = +page;
	size = +size;

	if (!page) page = 1;
	if (!size) size = 20;
	if (page > 10) page = 10;
	if (size > 20) size = 20;

	if (page >= 1 && size >= 1) {
		pagination.limit = size;
		pagination.offset = size * (page - 1);
	}

	let where = {};

	if (minLat && maxLat) {
		where.lat = {
			[Op.between]: [parseFloat(minLat), parseFloat(maxLat)],
		};
	}

	if (minLat) {
		where.lat = { [Op.gte]: parseFloat(minLat) };
	}

	if (maxLat) {
		where.lat = {
			[Op.lte]: parseFloat(maxLat),
		};
	}

	if (minLng && maxLng) {
		where.lng = {
			[Op.between]: [parseFloat(minLng), parseFloat(maxLng)],
		};
	}

	if (minLng) {
		where.lng = {
			[Op.gte]: parseFloat(minLng),
		};
	}

	if (maxLng) {
		where.lng = {
			[Op.lte]: parseFloat(maxLng),
		};
	}

	if (minPrice && maxPrice) {
		where.price = {
			[Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)],
		};
	}

	if (minPrice) {
		where.price = {
			[Op.gte]: parseFloat(minPrice),
		};
	}

	if (maxPrice) {
		where.price = {
			[Op.lte]: parseFloat(maxPrice),
		};
	}

	const spots = await Spot.findAll({
		where,
		include: [
			{
				model: Review,
			},
			{
				model: SpotImage,
			},
		],
		...pagination,
	});
	// console.log(games)
	let spotsList = [];
	spots.forEach((spot) => {
		spotsList.push(spot.toJSON());
	});

	spotsList.forEach((spot) => {
		spot.SpotImages.forEach((image) => {
			if (image.preview === true) {
				spot.preview = image.url;
			}
		});
		if (!spot.preview) {
			spot.preview = "no preview avaliable";
		}

		//getting the average rating for spot
		const spotRatings = {};

		spot.Reviews.forEach((review) => {
			//if first review for spot, initialize rating
			if (!spotRatings[review.spotId]) {
				spotRatings[review.spotId] = {
					totalStars: 0,
					reviewCount: 0,
				};
			}
			//update total stars and review count for spot
			spotRatings[review.spotId].totalStars += review.stars;
			spotRatings[review.spotId].reviewCount++;
		});

		//calculate average
		for (const spotId in spotRatings) {
			const rating = spotRatings[spotId];
			spot.avgStars = rating.totalStars / rating.reviewCount;
		}

		//if no ratings avaliable
		if (!spot.avgStars) {
			spot.avgStars = "no ratings avaliable";
		}
		delete spot.SpotImages;
		delete spot.Reviews;
	});

	res.json({ Spots: spotsList, page: page, size: size });
});
//get spots of current user
router.get("/current", requireAuth, async (req, res, next) => {
	const user = req.user;
	const spots = await Spot.findAll({
		where: {
			ownerId: user.id,
		},
		include: [
			{
				model: Review,
			},
			{
				model: SpotImage,
			},
		],
	});
	// console.log(games)
	let spotsList = [];
	spots.forEach((spot) => {
		spotsList.push(spot.toJSON());
	});

	spotsList.forEach((spot) => {
		spot.SpotImages.forEach((image) => {
			if (image.preview === true) {
				spot.preview = image.url;
			}
		});
		if (!spot.preview) {
			spot.preview = "no preview allowed";
		}

		//getting the average rating for spot
		const spotRatings = {};

		spot.Reviews.forEach((review) => {
			//if first review for spot, initialize rating
			if (!spotRatings[review.spotId]) {
				spotRatings[review.spotId] = {
					totalStars: 0,
					reviewCount: 0,
				};
			}
			//update total stars and review count for spot
			spotRatings[review.spotId].totalStars += review.stars;
			spotRatings[review.spotId].reviewCount++;
		});

		//calculate average
		for (const spotId in spotRatings) {
			const rating = spotRatings[spotId];
			spot.avgStars = rating.totalStars / rating.reviewCount;
		}

		//if no ratings avaliable
		if (!spot.avgStars) {
			spot.avgStars = "no ratings avaliable";
		}
		delete spot.SpotImages;
		delete spot.Reviews;
	});

	if (!spotsList.length) {
		res.json("Current user has no spots.");
	}

	res.json(spotsList);
});

// create a spot
router.post("/", requireAuth, validateSpot, async (req, res, next) => {
	const { address, city, state, country, lat, lng, name, description, price } =
		req.body;
	const { user } = req;

	const spot = await Spot.create({
		ownerId: user.id,
		address,
		city,
		state,
		country,
		lat,
		lng,
		name,
		description,
		price,
	});

	res.status(201);
	res.statusCode = 201;

	return res.json(
		spot
	);
});

//edit spot by ID (PROBLEM WITH VALIDATESPOT NOT WORKING)
router.put("/:spotId", requireAuth, validateSpot, async (req, res, next) => {
	const { spotId } = req.params;
	const { user } = req;
	const { address, city, state, country, lat, lng, name, description, price } =
		req.body;

	const editSpot = await Spot.findByPk(spotId);

	if (!editSpot) {
		res.status(404);
		res.statusCode = 404;
		return res.json({
			message: "Spot couldn't be found",
			StatusCode: res.statusCode,
		});
	}

	if (user.id !== editSpot.ownerId) {
		res.status(403);
		res.statusCode = 403;
		return res.json({
			message: "You cannot edit a spot you do not own.",
			StatusCode: res.statusCode,
		});
	}

	editSpot.address = address;
	editSpot.city = city;
	editSpot.state = state;
	editSpot.country = country;
	editSpot.lat = lat;
	editSpot.lng = lng;
	editSpot.name = name;
	editSpot.description = description;
	editSpot.price = price;

	await editSpot.save();

	res.json(editSpot);
});

//delete a spot
router.delete("/:spotId", requireAuth, async (req, res, next) => {
	const { spotId } = req.params;
	const { user } = req;
	const deleteSpot = await Spot.findByPk(spotId);

	if (!deleteSpot) {
		res.status(404);
		res.statusCode = 404;
		return res.json({
			message: "Spot couldn't be found",
			StatusCode: res.statusCode,
		});
	}

	if (user.id !== deleteSpot.ownerId) {
		res.status(403);
		res.statusCode = 403;
		return res.json({
			message: "You cannot edit a spot you do not own.",
			StatusCode: res.statusCode,
		});
	}

	deleteSpot.destroy();
	return res.json({
		message: "Successfully deleted",
		statusCode: res.statusCode,
	});
});

//get spot details by its id
router.get("/:spotId", async (req, res, next) => {
	const { spotId } = req.params;
	let count = 0;
	let sum = 0;

	const spotDetails = await Spot.findByPk(spotId, {
		include: [
			{
				model: Review,
			},
			{
				model: SpotImage,
				attributes: ["id", "url", "preview"],
			},
			{
				model: User,
				attributes: ["id", "firstName", "lastName"],
			},
		],
	});

	//we want numReviews, avgStarRating, SpotImages, owner
	if (!spotDetails) {
		res.status(404);
		res.statusCode = 404;
		return res.json({
			message: "Spot couldn't be found",
			StatusCode: res.statusCode,
		});
	}

	const details = spotDetails.toJSON();
	details.Reviews.forEach((review) => {
		if (review.stars) {
			count++;
			sum += review.stars;
		}
	});

	if (!count) {
		details.numReviews = "No reviews";
	} else {
		details.numReviews = count;
	}

	if (!(sum / count)) {
		details.avgStarRating = "No avgStarRating due to lack of reviews";
	} else {
		details.avgStarRating = sum / count;
	}

	delete details.Reviews;
	res.json(details);
});

//Add an Image to a Spot based on the Spot's id
router.post(
	"/:spotId/images",
	requireAuth,
	validateSpotImage,
	async (req, res, next) => {
		const { user } = req;
		const { spotId } = req.params;
		const { url, preview } = req.body;

		const spotImgAdd = await Spot.findByPk(spotId);

		if (!spotImgAdd) {
			res.status(404);
			res.statusCode = 404;
			return res.json({
				message: "Spot couldn't be found",
				StatusCode: res.statusCode,
			});
		}

		if (user.id !== spotImgAdd.ownerId) {
			res.status(403);
			res.statusCode = 403;
			return res.json({
				message: "You cannot edit a spot you do not own.",
				StatusCode: res.statusCode,
			});
		}

		const newImage = await SpotImage.create({
			spotId,
			url,
			preview,
		});

		await newImage.save();
		res.json({
			Id: newImage.id,
			url: newImage.url,
			preview: newImage.preview,
		});
	}
);

//get reviews by spot id
router.get("/:spotId/reviews", async (req, res, next) => {
	const { spotId } = req.params;
	const spot = await Spot.findByPk(spotId);

	if (!spot) {
		res.status(404);
		res.statusCode = 404;
		return res.json({
			message: "Spot couldn't be found",
			StatusCode: res.statusCode,
		});
	}

	const spotIdReviews = await spot.getReviews({
		include: [
			{
				model: User,
				attributes: ["id", "firstName", "lastName"],
			},
			{
				model: ReviewImage,
				attributes: ["id", "url"],
			},
		],
	});

	res.json({
		Reviews: spotIdReviews,
	});
});

router.post(
	"/:spotId/reviews",
	requireAuth,
	validateReview,
	async (req, res, next) => {
		const { spotId } = req.params;
		const user = req.user;
		const { review, stars } = req.body;

		const spot = await Spot.findByPk(spotId);

		if (!spot) {
			res.status(404);
			res.statusCode = 404;
			return res.json({
				message: "Spot couldn't be found",
				StatusCode: res.statusCode,
			});
		}

		const userReview = await Review.findOne({
			where: {
				userId: user.id,
				spotId: spotId,
			},
		});

		if (userReview) {
			res.status(403);
			res.statusCode = 403;
			return res.json({
				message: "User already has a review for this spot",
				StatusCode: res.statusCode,
			});
		}

		const spotReview = await spot.createReview({
			userId: user.id,
			review: review,
			stars: stars,
		});

		res.json(spotReview);
	}
);

//Get all bookings for a spot based on the spot Id
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
	const { spotId } = req.params;
	const user = req.user;

	const spot = await Spot.findByPk(spotId);

	if (!spot) {
		res.status(404);
		res.statusCode = 404;
		return res.json({
			message: "Spot couldn't be found",
			StatusCode: res.statusCode,
		});
	}

	if (user.id !== spot.ownerId) {
		const notUserBooking = await Booking.findAll({
			where: {
				spotId: spotId,
			},
			attributes: ["spotId", "startDate", "endDate"],
		});
		return res.json({
			Bookings: notUserBooking,
		});
	} else {
		const userBooking = await Booking.findAll({
			where: {
				spotId: spotId,
			},
			include: [
				{
					model: User,
					attributes: ["id", "firstName", "lastName"],
				},
			],
		});
		return res.json({
			Bookings: userBooking,
		});
	}
});

//create a booking from a spot based on the spot's id
router.post(
	"/:spotId/bookings",
	requireAuth,
	validateBooking,
	async (req, res, next) => {
		const { spotId } = req.params;
		const user = req.user;
		const { startDate, endDate } = req.body;
		const startDateInput = new Date(startDate);
		const endDateInput = new Date(endDate);

		const spot = await Spot.findByPk(spotId);

		if (!spot) {
			res.status(404);
			res.statusCode = 404;
			return res.json({
				message: "Spot couldn't be found",
				StatusCode: res.statusCode,
			});
		}

		if (user.id === spot.ownerId) {
			res.status(403);
			res.statusCode = 403;
			return res.json({
				message: "Spot must NOT belong to current user",
				StatusCode: res.statusCode,
			});
		}

		if (endDateInput <= startDateInput) {
			res.status(400);
			res.statusCode = 400;
			return res.json({
				message: "Validation error",
				StatusCode: res.statusCode,
				errors: {
					endDate: "endDate cannot be on or before startDate",
				},
			});
		}

		const bookings = await Booking.findAll({
			where: {
				spotId: spotId,
			},
		});

		if (bookings) {
			bookings.forEach((booking) => {
				const currentStart = new Date(booking.startDate);
				const currentEnd = new Date(booking.endDate);

				if (startDateInput >= currentStart && startDateInput <= currentEnd) {
					res.status(403);
					res.statusCode = 403;
					return res.json({
						message:
							"Sorry, this spot is already booked for the specified dates",
						StatusCode: res.statusCode,
						errors: {
							startDate: "startDate conflicts with an existing booking",
						},
					});
				} else if (endDateInput >= currentStart && endDateInput <= currentEnd) {
					res.status(403);
					res.statusCode = 403;
					return res.json({
						message:
							"Sorry, this spot is already booked for the specified dates",
						StatusCode: res.statusCode,
						errors: {
							endDate: "endDate conflicts with an existing booking",
						},
					});
				} else if (
					endDateInput <= currentEnd &&
					startDateInput >= currentStart
				) {
					res.status(403);
					res.statusCode = 403;
					return res.json({
						message:
							"Sorry, this spot is already booked for the specified dates",
						StatusCode: res.statusCode,
						errors: {
							endDate: "endDate conflicts with an existing booking",
							startDate: "startDate conflicts with an existing booking",
						},
					});
				}
			});
		}
		const newBookingSpot = await Booking.create({
			spotId,
			userId: user.id,
			startDate: startDateInput,
			endDate: endDateInput,
		});
		return res.json(newBookingSpot);
	}
);

module.exports = router;
