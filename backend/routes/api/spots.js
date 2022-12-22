const express = require("express");

const {
	setTokenCookie,
	restoreUser,
	requireAuth,
} = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Spot, Review, SpotImage, User } = require("../../db/models");

const router = express.Router();

const validateSpot = [
	check("address").notEmpty().withMessage("Street address is required"),
	check("city").notEmpty().withMessage("City is required"),
	check("state").notEmpty().withMessage("State is required"),
	check("country").notEmpty().withMessage("Country is required"),
	check("lat").notEmpty().isDecimal().withMessage("Latitude is not valid"),
	check("lng").notEmpty().isDecimal().withMessage("Longitude is not valid"),
	check("name").notEmpty().isLength({ min: 1, max: 50 }).withMessage("Name must be less than 50 characters"),
	check("description").notEmpty().withMessage("Description is required"),
	check("price").notEmpty().isFloat().withMessage("Price per day is required"),
	handleValidationErrors,
];

const validateSpotImage = [
    check('url').notEmpty().withMessage("URL is required"),
    check('preview').notEmpty().isBoolean().withMessage("Must enter 'true' or 'false'"),
    handleValidationErrors,
];

//get all spots
router.get("/", async (req, res, next) => {
	const spots = await Spot.findAll({
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

	res.json(spotsList);
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

	return res.json({
		spot: spot,
	});
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
                attributes: ['id','url','preview']
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
    ]
    })

    //we want numReviews, avgStarRating, SpotImages, owner
	if (!spotDetails) {
		res.status(404);
		res.statusCode = 404;
		return res.json({
			message: "Spot couldn't be found",
			StatusCode: res.statusCode,
		});
	}

    const details = spotDetails.toJSON()
    details.Reviews.forEach(review => {
        if(review.stars){
            count++
            sum += review.stars
        }
    })

    if(!count){
        details.numReviews= "No reviews"
    } else {
        details.numReviews = count
    }

    if(!(sum/count)){
        details.avgStarRating = "No avgStarRating due to lack of reviews"
    } else {
        details.avgStarRating = sum / count
    }

    delete details.Reviews
    res.json(details)
});

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, validateSpotImage, async(req, res, next) =>{
    const { user } = req;
    const { spotId } = req.params;
    const { url, preview } = req.body

    const spotImgAdd = await Spot.findByPk(spotId)

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
    })

    await newImage.save()
    res.json({
        Id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    })

})



module.exports = router;
