const express = require("express");
const { getRestaurantProfile, updateRestaurantProfile, createMenu, getAllMenu, updateMenu, deleteMenu, getRestaurantOrder, updateOrderStatus } = require("../controllers/restaurantOwnerController");
const { isAuthenticated, allowRoles } = require("../middlewares/auth");

const restaurantOwnerRouter = express.Router();

restaurantOwnerRouter.use(isAuthenticated);
restaurantOwnerRouter.use(allowRoles(["restaurant"]))

restaurantOwnerRouter.get("/", getRestaurantProfile);
restaurantOwnerRouter.put("/:id", updateRestaurantProfile)
restaurantOwnerRouter.post("/menus", createMenu)
restaurantOwnerRouter.get("/menus", getAllMenu)
restaurantOwnerRouter.put("/menus/:id", updateMenu)
restaurantOwnerRouter.delete("/menus/:id", deleteMenu)
restaurantOwnerRouter.get("/orders", getRestaurantOrder)
restaurantOwnerRouter.put("/orders/:id", updateOrderStatus)

module.exports = restaurantOwnerRouter;