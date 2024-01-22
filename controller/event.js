const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Event = require("../model/event");
const Shop = require("../model/shop");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const fs = require("fs");

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

// get all events
router.get("/get-all-events", async (req, res, next) => {
    try {
        const events = await Event.find();
        res.status(201).json({
            success: true,
            events,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});  

// get all events of a shop
router.get(
    "/get-all-events/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const event = await Event.find({ shopId: req.params.id });

            res.status(201).json({
                success: true,
                event,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// delete events of a shop 
router.delete("/delete-shop-event/:id", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const productId = req.params.id;

        const eventData = await Event.findById(productId);

        eventData.images.forEach((imageUrl) => {
            const filename = imageUrl;
            const filePath = `uploads/${filename}`;

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err)
                }
            })
        })

        const event = await Event.findByIdAndDelete(productId);

        if (!event) {
            return next(new ErrorHandler("Event not found by this id", 500));
        };

        res.status(201).json({
            success: true,
            message: "Event deleted successfully!"
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400))

    }
}))


module.exports = router;