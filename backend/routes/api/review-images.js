const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { Review, ReviewImage } = require("../../db/models");
const router = express.Router();

//delete review image
router.delete("/:imageId", requireAuth, async (req, res, next) => {
    const imageId = req.params.imageId
    const user = req.user

    const deleteReviewImage = await ReviewImage.findByPk(imageId, {
        include: [
            {
                model: Review
            }
        ]
    })

    if (!deleteReviewImage) {
        res.status(404);
        res.statusCode = 404;
        return res.json({
            message: "Review Image couldn't be found",
            StatusCode: res.statusCode
        });
    }

    if (user.id !== deleteReviewImage.Review.userId) {
        res.status(403);
        res.statusCode = 403;
        return res.json({
            "message": "Review must belong to the current user",
            "statusCode": res.statusCode
        })
    }


    await deleteReviewImage.destroy()

    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
  })

module.exports = router;
