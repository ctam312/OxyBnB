const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//get all current user bookings

router.get("/current", requireAuth, async (req,res,next) => {
    const { user } = req;
	const userBookings = await Booking.findAll({
		where: {
			userId: user.id,
		},
		include: [
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
		],
	});

    let bookingList = [];

	userBookings.forEach((booking) => {
		bookingList.push(booking.toJSON());
	});

	bookingList.forEach((booking) => {
		booking.Spot.SpotImages.forEach((image) => {
			if (image.preview === true) {
				booking.previewImage = image.url;
			}
		});
		if (!booking.previewImage) {
			booking.previewImage = "no preview avaliable";
		}
		delete booking.Spot.SpotImages;
	});

	res.json({
		Bookings: bookingList,
	});
})

//make a function to convert given date ("2021-11-19") to a new Date object

module.exports = router;