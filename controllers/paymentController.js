const Order = require("../models/order")
const Razorpay = require("razorpay")
const crypto = require("crypto")

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentController = {
  createPaymentOrder: async (request, response) => {
    try {
       
        const { orderId } = request.body
         console.log("ORDER ID:", orderId);
            console.log("USER ID:", request.userId);

        const order = await Order.findOne({
            _id: orderId,
            user: request.userId
        });

        console.log("ORDER:", order);

        if (!order) {
            return response.status(404).json({ message: "Order not found" });
        }

        if (order.paymentMethod === "Cash on Delivery") { 
            return response.status(400).json({ message: "Cash on Delivery does not require online payment" }); 
        }

        if (order.paymentStatus === "Paid") { return response.status(400).json({ message: "Order is already paid" }); }

        const razorpayOrder = await razorpay.orders.create({
            amount: order.totalAmount * 100,
            currency: "INR",
            receipt: `order_${order._id}`
        });


            console.log("RAZORPAY ORDER:", razorpayOrder);

        order.paymentOrderId = razorpayOrder.id;

        await order.save();

        return response.status(200).json({
            message: "Payment order created successfully",result: razorpayOrder
        });

    }catch(e) {
        console.log("PAYMENT ERROR:", e);
        return response.status(500).json({message: e.message})
    }
  },


  verifyPayment: async (request, response) => {
    try {
        const {
            orderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = request.body;

        const order = await Order.findOne({
            _id: orderId,
            user: request.userId
        });

        if (!order) {
            return response.status(404).json({
                message: "Order not found"
        });

        
        return response.status(200).json({
            message: "Payment order created successfully",result: razorpayOrder
        });

        const generatedSignature = crypto.createHmac(
            "sha256",
            RAZORPAY_KEY_SECRET
        )
        .update(
            razorpay_order_id + " | " + razorpay_payment_id
        )
        .digest("hex");

        if(generatedSignature !== razorpay_signature){
            order.paymentStatus = "Failed";
            await order.save();

            return response.status(400).json({
                message: "Payment verification failed"
            });
        }

        order.paymentStatus = "Paid";
        order.paymentId = razorpay_payment_id;

        await order.save();

         return response.status(200).json({
            message: "Payment verified successfully",
            result: order
        });

    } 
    
}      catch (e) {
        console.log("PAYMENT ERROR:", e);
        return response.status(500).json({message: e.message})
    }
  },


}

module.exports = paymentController