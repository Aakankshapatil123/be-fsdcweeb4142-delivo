const express = require("express");
const { isAuthenticated, allowRoles } = require("../middlewares/auth");
const { createRestaurant, getAllRestaurants, getRestaurantById, updateRestaurants, deleteRestaurants, getAllUsers, getUserById, deleteUser, getAllOrders, updateOrderStatus, getOrderById, getAllReviews, deleteReview,  getDashboardStatistics } = require("../controllers/adminController");

const upload = require("../middlewares/Upload")

const restaurantRouter = express.Router();


restaurantRouter.use(isAuthenticated);
restaurantRouter.use(allowRoles(["admin"]))

// restaurant
restaurantRouter.post("/", upload.single("restaurantImage"),createRestaurant)


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
restaurantRouter.get("/dashboard", getDashboardStatistics)



//  Restaurant by ID
restaurantRouter.get("/", getAllRestaurants)
restaurantRouter.put("/:id", updateRestaurants)
restaurantRouter.delete("/:id", deleteRestaurants)




module.exports = restaurantRouter;