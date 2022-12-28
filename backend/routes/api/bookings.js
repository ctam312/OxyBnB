const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateBooking = [
	check("startDate").isDate().withMessage("startDate is not valid"),
	check("endDate").isDate().withMessage("endDate is not valid"),
	handleValidationErrors,
];

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

//edit a booking
router.put(
	"/:bookingId",
	requireAuth,
	validateBooking,
	async (req, res, next) => {
		const { bookingId } = req.params;
		const user = req.user;
		const { startDate, endDate } = req.body;
		const startDateInput = new Date(startDate);
		const endDateInput = new Date(endDate);

		const editBooking = await Booking.findByPk(bookingId);

		if (!editBooking) {
			res.status(404);
			res.statusCode = 404;
			return res.json({
				message: "Booking couldn't be found",
				StatusCode: res.statusCode,
			});
		}

		if (user.id !== editBooking.userId) {
			res.status(403);
			res.statusCode = 403;
			return res.json({
				message: "Booking MUST belong to current user",
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
				spotId: editBooking.spotId,
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
		
		editBooking.startDate = startDateInput;
		editBooking.endDate = endDateInput
		
		await editBooking.save()
		return res.json(editBooking);
	}
);

//delete a booking
router.delete("/:bookingId", requireAuth, async (req, res, next) =>{
	const { bookingId } = req.params
	const user = req.user;

	const deleteBooking = await Booking.findByPk(bookingId);

	if (!deleteBooking) {
		res.status(404);
		res.statusCode = 404;
		return res.json({
			message: "Booking couldn't be found",
			StatusCode: res.statusCode,
		});
	}

	if (user.id !== deleteBooking.userId){
		res.status(403);
		res.statusCode = 403;
		return res.json({
			message: "Booking must belong to the current user or the Spot must belong to the current user",
			StatusCode: res.statusCode
		})
	}

	//booking that started, maybe use new Date() to compare
	if (deleteBooking.startDate < new Date()) {
		res.status(403);
		res.statusCode = 403;
		return res.json({
			message: "Bookings that have been started can't be deleted",
			StatusCode: res.statusCode,
		});
	}
	await deleteBooking.destroy()

	return res.json({
		"message": "Sucessfully deleted",
		"statusCode": 200
	})

})

module.exports = router;