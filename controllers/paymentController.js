const crypto = require("crypto");
const Razorpay = require("razorpay");

const Order = require("../models/order");
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require("../utils/config");

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

const paymentController = {
  
  // CREATE RAZORPAY ORDER

  createPaymentOrder: async (request, response) => {
    try {
      const { orderId } = request.params;

      // console.log("=================================");
      // console.log("CREATE PAYMENT ORDER");
      // console.log("MongoDB Order ID:", orderId);
      // console.log("=================================");

      // -------------------------------------------------------
      // CHECK ORDER ID
      // -------------------------------------------------------

      if (!orderId) {
        return response.status(400).json({
          message: "Order ID is required",
        });
      }

      // FIND ORDER

      const order = await Order.findById(orderId);

      if (!order) {
        console.log("ORDER NOT FOUND:", orderId);

        return response.status(404).json({
          message: "Order not found",
        });
      }

      console.log("ORDER FOUND:", order._id);
      console.log("TOTAL AMOUNT:", order.totalAmount);
      console.log("PAYMENT METHOD:", order.paymentMethod);

      // CHECK PAYMENT METHOD

      if (order.paymentMethod !== "UPI" && order.paymentMethod !== "Card") {
        return response.status(400).json({
          message: "Razorpay payment is only available for UPI or Card",
        });
      }

      // CHECK PAYMENT STATUS

      if (order.paymentStatus === "Paid") {
        return response.status(400).json({
          message: "Order payment is already completed",
        });
      }

      // CHECK AMOUNT

      const totalAmount = Number(order.totalAmount);

      if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
        return response.status(400).json({
          message: "Invalid order amount",
        });
      }

      // Razorpay amount is in paise
      const amount = Math.round(totalAmount * 100);

      // console.log("Amount in rupees:", totalAmount);
      // console.log("Amount in paise:", amount);

      // CREATE RAZORPAY ORDER

      const razorpayOrder = await razorpay.orders.create({
        amount: amount,
        currency: "INR",
        receipt: `order_${order._id}`,
        notes: {
          mongodbOrderId: order._id.toString(),
        },
      });

      // console.log("RAZORPAY ORDER CREATED:", razorpayOrder);

      // SAVE RAZORPAY ORDER ID

      order.paymentOrderId = razorpayOrder.id;
      order.paymentStatus = "Pending";

      await order.save();

      // console.log("RAZORPAY ORDER ID SAVED:", order.paymentOrderId);

      // RESPONSE

      return response.status(200).json({
        message: "Razorpay order created successfully",

        result: {
          id: razorpayOrder.id,
          entity: razorpayOrder.entity,
          amount: razorpayOrder.amount,
          amount_due: razorpayOrder.amount_due,
          currency: razorpayOrder.currency,
          receipt: razorpayOrder.receipt,
        },
      });
    } catch (error) {
      console.log("CREATE PAYMENT ORDER ERROR:", error);

      return response.status(500).json({
        message:
          error?.error?.description ||
          error?.message ||
          "Unable to create Razorpay order",
      });
    }
  },

  // VERIFY PAYMENT

  verifyPayment: async (request, response) => {
    try {
      const {
        orderId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = request.body;

      // console.log("=================================");
      // console.log("VERIFY PAYMENT");
      // console.log("REQUEST BODY:", request.body);
      // console.log("=================================");

      // VALIDATION

      if (!orderId) {
        return response.status(400).json({
          message: "Order ID is required",
        });
      }

      if (!razorpay_order_id) {
        return response.status(400).json({
          message: "Razorpay order ID is required",
        });
      }

      if (!razorpay_payment_id) {
        return response.status(400).json({
          message: "Razorpay payment ID is required",
        });
      }

      if (!razorpay_signature) {
        return response.status(400).json({
          message: "Razorpay signature is required",
        });
      }


      // FIND MONGODB ORDER

      const order = await Order.findById(orderId);

      if (!order) {
        return response.status(404).json({
          message: "Order not found",
        });
      }

      // console.log("MongoDB Order:", order._id);

      // console.log("Saved Razorpay Order ID:", order.paymentOrderId);

      // console.log("Received Razorpay Order ID:", razorpay_order_id);

      
      // CHECK RAZORPAY ORDER ID
      

      if (order.paymentOrderId !== razorpay_order_id) {
        return response.status(400).json({
          message: "Razorpay order ID does not match",
        });
      }

      // CREATE SIGNATURE
      

      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      // console.log("Generated Signature:", generatedSignature);

      // console.log("Received Signature:", razorpay_signature);

   
      // VERIFY SIGNATURE
      

      const isValid = crypto.timingSafeEqual(
        Buffer.from(generatedSignature, "utf8"),
        Buffer.from(razorpay_signature, "utf8"),
      );

      if (!isValid) {
        return response.status(400).json({
          message: "Payment signature verification failed",
        });
      }

      // PAYMENT SUCCESS
      

      order.paymentStatus = "Paid";

      order.paymentId = razorpay_payment_id;

      order.paymentOrderId = razorpay_order_id;

      order.paymentAmount = Number(order.totalAmount);

      order.paidAt = new Date();

      await order.save();

      // console.log("PAYMENT VERIFIED SUCCESSFULLY");

      
      // RESPONSE
      

      return response.status(200).json({
        message: "Payment verified successfully",

        result: {
          orderId: order._id,
          razorpayOrderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          paymentStatus: order.paymentStatus,

           paymentMethod: order.paymentMethod,
           paymentAmount: order.paymentAmount,
           paidAt: order.paidAt,
        },
      });
    } catch (error) {
      // console.log("VERIFY PAYMENT ERROR:", error);

      return response.status(500).json({
        message: error?.message || "Payment verification failed",
      });
    }
  },
};

module.exports = paymentController;
