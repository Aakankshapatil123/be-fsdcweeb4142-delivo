const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    foodType: {
      type: String,
      enum: ["veg", "non-veg"],
      default: "veg",
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    extras: [
      {
        name: {
          type: String,
          trim: true,
          required: true,
        },
        price: {
          type: Number,
          min: 0,
          required: true,
        },
      },
    ],

    image: {
      type: String,
      default: "",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    nutrition: {
      calories: {
        type: Number,
        min: 0,
      },

      protein: {
        type: Number,
        min: 0,
      },

      carbohydrates: {
        type: Number,
        min: 0,
      },

      fat: {
        type: Number,
        min: 0,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Menu", menuSchema, "menus");
