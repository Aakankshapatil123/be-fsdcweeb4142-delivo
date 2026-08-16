const express = require("express");

const paymentController = require("../controllers/paymentController");

const paymentRouter = express.Router();

// CREATE RAZORPAY ORDER

paymentRouter.post("/create-order/:orderId",paymentController.createPaymentOrder);

// VERIFY RAZORPAY PAYMENT

paymentRouter.post("/verify", paymentController.verifyPayment);

module.exports = paymentRouter;
