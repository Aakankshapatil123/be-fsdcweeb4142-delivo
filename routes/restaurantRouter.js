const express = require("express");
const { isAuthenticated, allowRoles } = require("../middlewares/auth");
const { createRestaurant, getAllRestaurants, getRestaurantById, updateRestaurants, deleteRestaurants, getAllUsers, getUserById, deleteUser, getAllOrders, updateOrderStatus, getOrderById, getAllReviews, deleteReview, getDashboardStats } = require("../controllers/adminController");

const restaurantRouter = express.Router();


restaurantRouter.use(isAuthenticated);
restaurantRouter.use(allowRoles(["admin"]))

// restaurant
restaurantRouter.post("/", createRestaurant)
restaurantRouter.get("/", getAllRestaurants)

// users
restaurantRouter.get("/users", getAllUsers)
restaurantRouter.get("/users/:id", getUserById)
restaurantRouter.delete("/users/:id", deleteUser)

// orders
restaurantRouter.get("/orders", getAllOrders)
restaurantRouter.get("/orders/:id", getOrderById)
restaurantRouter.put("/orders/:id", updateOrderStatus)


// reviews
restaurantRouter.get("/reviews", getAllReviews)
restaurantRouter.delete("/reviews/:id", deleteReview)


// dashboard
restaurantRouter.get("/", getDashboardStats)

//  Restaurant by ID
restaurantRouter.get("/:id", getRestaurantById)
restaurantRouter.put("/:id", updateRestaurants)
restaurantRouter.delete("/:id", deleteRestaurants)




module.exports = restaurantRouter;