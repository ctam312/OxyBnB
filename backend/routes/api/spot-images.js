const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { Spot, SpotImage } = require("../../db/models");
const router = express.Router();

//delete a 
router.delete("/:imageId", requireAuth, async (req, res, next) => {
    const imageId = req.params.imageId
    const user = req.user

    console.log(imageId)

    const deleteSpotImage = await SpotImage.findByPk(imageId, {
        include: [
            {
                model: Spot
            }
        ]
    })

    if (!deleteSpotImage) {
        res.status(404);
        res.statusCode = 404;
        return res.json({
            message: "Spot Image couldn't be found",
            StatusCode: res.statusCode
        });
    }

    if (user.id !== deleteSpotImage.Spot.ownerId) {
        res.status(403);
        res.statusCode = 403;
        return res.json({
            message: "Spot must belong to the current user",
            statusCode: res.statusCode
        })
    }

    await deleteSpotImage.destroy()

    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
});


module.exports = router;