// Import express
const express = require("express");
const { getAllRestaurants, getRestaurantById, getMenuByRestaurant, getRestaurantMenu } = require("../controllers/restaurantListingController");

// Import restaurant controller functions


// Create router
const restaurantListingRouter = express.Router();

// All restaurants
restaurantListingRouter.get("/", getAllRestaurants);

// Restaurant details
restaurantListingRouter.get("/:id", getRestaurantById);

// Restaurant menu
restaurantListingRouter.get("/:id/menu", getRestaurantMenu);




// Export router
module.exports = restaurantListingRouter;