const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Event = require("../model/event");
const Shop = require("../model/shop");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");

// create event
router.post("/create-event", upload.array("images"), catchAsyncErrors(async (req, res, next) => {
    try {
        const shopId = req.body.shopId;
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return next(new ErrorHandler("Shop id is invalid", 400));
        } else {
            const files = req.files;
            const imageUrl = files.map((file) => `${file.filename}`);
            const eventData = req.body;
            eventData.images = imageUrl;
            eventData.shop = shop;

            const eventProduct = await Event.create(eventData);

            res.status(201).json({
                success: true,
                eventProduct
            })

        }
    } catch (error) {
        return next(new ErrorHandler(error, 400))
    }
}));

module.exports = router;