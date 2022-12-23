const express = require("express");

const {
	requireAuth,
} = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
	Spot,
	Review,
	SpotImage,
	User,
	ReviewImage,
} = require("../../db/models");

const router = express.Router();

const validateReview = [
	check("review").notEmpty().withMessage("Review text is required"),
	check("stars")
		.notEmpty()
		.isInt({ min: 1, max: 5 })
		.withMessage("Stars must be an integer from 1 to 5"),
	handleValidationErrors,
];

//get review of current user
router.get("/current", requireAuth, async (req, res, next) => {
	const { user } = req;
	const userReviews = await Review.findAll({
		where: {
			userId: user.id,
		},
		include: [
			{
				model: User,
				attributes: ["id", "firstName", "lastName"],
			},
			{
				model: Spot,
				attributes: {
					exclude: ["description", "createdAt", "updatedAt"],
				},
				include: [
					{
						model: SpotImage,
						attributes: ["url", "preview"],
					},
				],
			},
			{
				model: ReviewImage,
				attributes: ["id", "url"],
			},
		],
	});

	let reviewsList = [];
	userReviews.forEach((review) => {
		reviewsList.push(review.toJSON());
	});

	reviewsList.forEach((review) => {
		review.Spot.SpotImages.forEach((image) => {
			if (image.preview === true) {
				review.previewImage = image.url;
			}
		});
		if (!review.previewImage) {
			review.previewImage = "no preview avaliable";
		}
		delete review.Spot.SpotImages;
	});

	res.status(201);
	res.statusCode = 201;
	res.json({
		Reviews: reviewsList,
	});
});

router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
	const { user } = req;
	const { reviewId } = req.params;
	const { url } = req.body;

	const review = await Review.findByPk(reviewId);

	if (!review) {
		res.status(404);
		res.statusCode = 404;
		return res.json({
			message: "Review couldn't be found",
			StatusCode: res.statusCode,
		});
	}

	//review MUST belong to the user
	if (user.id !== review.userId) {
		res.status(403);
		res.statusCode = 403;
		return res.json({
			message: "Review must belong to the current user",
			StatusCode: res.statusCode,
		});
	}

	const reviewImages = await review.getReviewImages();

	//length check *remember to just use .length instead of .length()
	if (reviewImages.length >= 10) {
		res.status(403);
		res.statusCode = 403;
		return res.json({
			message: "Maximum number of images for this resource was reached",
			StatusCode: res.statusCode,
		});
	}

	const addReviewImage = await review.createReviewImage({
		//TRY MAKE
		url: url,
	});

	res.json({
		id: addReviewImage.id,
		url: addReviewImage.url,
	});
});

//edit a review made (follow owner rule for user.id reviewUserId) //PLANE CHECK NO CONFIRM
router.put(
	"/:reviewId",
	requireAuth,
	validateReview,
	async (req, res, next) => {
		const { reviewId } = req.params;
		const { user } = req;
		const { review, stars } = req.body;

		let editReview = await Review.findByPk(reviewId);

		if (!editReview) {
			res.status(404);
			res.statusCode = 404;
			return res.json({
				message: "Review couldn't be found",
				StatusCode: res.statusCode,
			});
		}

		//review MUST belong to the user
		if (user.id !== editReview.userId) {
			res.status(403);
			res.statusCode = 403;
			return res.json({
				message: "Review must belong to the current user",
				StatusCode: res.statusCode,
			});
		}

		editReview.review = review;
		editReview.stars = stars;
		await editReview.save();

		res.json(editReview);
	}
);

//delete review //PLANE CHECK DIDNT CONFIRM
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
	const { reviewId } = req.params;
	const { user } = req;

	let review = await Review.findByPk(reviewId);

	if (!review) {
		res.status(404);
		res.statusCode = 404;
		return res.json({
			message: "Review couldn't be found",
			StatusCode: res.statusCode,
		});
	}

	//review MUST belong to the user
	if (user.id !== review.userId) {
		res.status(403);
		res.statusCode = 403;
		return res.json({
			message: "Review must belong to the current user",
			StatusCode: res.statusCode,
		});
	}

	review.destroy();

	res.json({
		message: "Successfully deleted",
		statusCode: 200,
	});
});

module.exports = router;
