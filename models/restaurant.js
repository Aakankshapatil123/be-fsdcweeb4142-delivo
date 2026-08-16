const mongoose = require("mongoose")

const restaurantSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim: true
    },

    description: {
      type: String,
      required: true
    },

    cuisine: {
        type:String,
        required:true
    },

    location: {
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

    openingHours: {
      type: String,
      required: true
    },

    image: {
      type: String,
      default: ""
    }, 

    rating: {
      type: Number,
      default: 0
    }, 

    totalReviews: {
      type: Number,
      default: 0
    },

    priceRange: {
      type: String,
      enum: ["₹", "₹₹", "₹₹₹", "₹₹₹₹"],
      default: "₹₹"
    }, 

   owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }, 

   isOpen: {
      type: Boolean,
      default: true
    } 

},{timestamps: true})

module.exports = mongoose.model('Restaurant', restaurantSchema, 'Restaurants')