const express = require("express");
const { getRestaurants, getRestaurantById, createOrder, getMyOrders, cansalOrders, addReviwes, updateProfile, getOrderById } = require("../controllers/userController");
const { isAuthenticated, allowRoles } = require("../middlewares/auth");
const upload = require("../middlewares/Upload")



const userRouter = express.Router();

userRouter.use(isAuthenticated);
userRouter.use(allowRoles(["user"]))
 
userRouter.get("/restaurants", getRestaurants)
userRouter.get("/restaurants/:id", getRestaurantById)
userRouter.post("/orders", createOrder)
userRouter.get("/orders/:id", getOrderById)
userRouter.get("/orders", getMyOrders)
userRouter.delete("/orders/:id", cansalOrders)
userRouter.post("/reviews", addReviwes)
userRouter.put("/profiles",upload.single("profilePicture"),  updateProfile)

module.exports = userRouter;