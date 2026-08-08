const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },

    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required:true
    },

    items: [
        {
            name: {
                type: String,
                required: true
            },

            quantity: {
                type: Number,
                required: true,
                min: 1
            },

            price: {
                type: Number,
                required: true
            },

            specialInstructions: {
                type: String,
                default: ""
            }
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["Cash on Delivery", "UPI", "Card"],
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    },

    orderStatus: {
        type: String,
        enum: [
            "Pending",
            "Preparing",
            "Out for Delivery",
            "Delivered",
            "Cancelled"
        ],
        default: "Pending"
    },
    
     deliveryType: {
        type: String,
        enum: ["Immediate", "Scheduled"],
        default: "Immediate"
    },

    scheduledDeliveryTime: {
        type: Date
    },
    
    deliveryAddress: {
        address: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        state: {
            type: String,
            required: true
        },

        pincode: {
            type: String,
            required: true
        }
    },

    paymentId: {
        type: String,
        default: ""
    },

    paymentOrderId: {
       type: String,
       default: ""
    }

},{ timestamps: true})

module.exports = mongoose.model("Order", orderSchema, "orders")