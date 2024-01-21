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

        if (!isCoupounCodeExists) {
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
module.exports = router; 