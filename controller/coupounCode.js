const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const { upload } = require("../multer");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const CounpounCode = require("../model/coupounCode");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller } = require("../middleware/auth");

// create coupoun code
router.post("/create-coupoun-code", isSeller, catchAsyncErrors(async (req, res, next) => {
  try {
    const isCoupounCodeExists = await CounpounCode.find({ name: req.body.name });

    if (isCoupounCodeExists.length !== 0) {
      return next(new ErrorHandler("Coupoun code already exists!", 400));
    }
    const coupounCode = await CounpounCode.create(req.body);

    res.status(201).json({
      success: true,
      coupounCode
    })
  } catch (error) {
    return next(new ErrorHandler(error, 400))
  }
}))

// get all coupouns of a shop
router.get("/get-coupouns/:id", isSeller, catchAsyncErrors(async (req, res, next) => {
  try {
    const coupounCode = await CounpounCode.find({ shopId: req.seller.id })

    res.status(201).json({
      success: true,
      coupounCode
    })
  } catch (error) {
    return next(new ErrorHandler(error, 400))
  }
}));

// delete coupoun code of a shop
router.delete(
  "/delete-coupoun/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCode = await CounpounCode.findByIdAndDelete(req.params.id);

      if (!couponCode) {
        return next(new ErrorHandler("Coupon code dosen't exists!", 400));
      }
      res.status(201).json({
        success: true,
        message: "Coupon code deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get coupon code value by its name
router.get(
  "/get-coupon-value/:name",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCode = await CounpounCode.findOne({ name: req.params.name });

      res.status(200).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router; 