const express = require("express");

const { isAuthenticated, allowRoles } = require("../middlewares/auth");
const { createPaymentOrder, verifyPayment } = require("../controllers/paymentController");

const paymentRouter = express.Router();

paymentRouter.use(isAuthenticated);
paymentRouter.use(allowRoles(["user"]))

paymentRouter.post("/", createPaymentOrder)
paymentRouter.post("/verify", verifyPayment)

module.exports = paymentRouter