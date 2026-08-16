const express = require("express");
const { getRestaurants, getRestaurantById, createOrder, getMyOrders, cansalOrders, addReviwes, updateProfile, getOrderById, getRestaurantReviews, getMyReviews, updateMyReview, deleteMyReview, getPaymentHistory } = require("../controllers/userController");
const { isAuthenticated, allowRoles } = require("../middlewares/auth");
const upload = require("../middlewares/Upload")



const userRouter = express.Router();


 
userRouter.get("/restaurants", getRestaurants)
userRouter.get("/restaurants/:id", getRestaurantById)
userRouter.get("/reviews/restaurant/:id", getRestaurantReviews)

userRouter.use(isAuthenticated);
userRouter.use(allowRoles(["user"]))

userRouter.post("/orders", createOrder)
userRouter.get("/orders/:id", getOrderById)
userRouter.get("/orders", getMyOrders)
userRouter.delete("/orders/:id", cansalOrders)

userRouter.get("/reviews/my", getMyReviews)
userRouter.post("/reviews", addReviwes)
userRouter.put("/reviews/:id", updateMyReview)
userRouter.delete("/reviews/:id", deleteMyReview)

userRouter.get("/payment/history", getPaymentHistory);

userRouter.put("/profiles",upload.single("profilePicture"),  updateProfile)

module.exports = userRouter;