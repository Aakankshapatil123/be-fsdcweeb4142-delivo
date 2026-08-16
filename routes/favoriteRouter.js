const express = require("express");

const {
  addRestaurantFavorite,
  removeRestaurantFavorite,
  addMenuFavorite,
  removeMenuFavorite,
  getMyFavorites,
  checkRestaurantFavorite,
  checkMenuFavorite,
} = require("../controllers/favoriteController");

const {
  isAuthenticated,
  allowRoles,
} = require("../middlewares/auth");

const favoriteRouter = express.Router();



favoriteRouter.use(isAuthenticated);
favoriteRouter.use(allowRoles(["user"]));


favoriteRouter.post( "/restaurant",addRestaurantFavorite);

// Remove restaurant from favorites
favoriteRouter.delete( "/restaurant/:restaurantId",removeRestaurantFavorite);

// Check restaurant favorite
favoriteRouter.get("/restaurant/:restaurantId/check", checkRestaurantFavorite);

// Add menu item to favorites
favoriteRouter.post( "/menu", addMenuFavorite);

// Remove menu item from favorites
favoriteRouter.delete("/menu/:menuId", removeMenuFavorite);

// Check menu favorite
favoriteRouter.get("/menu/:menuId/check", checkMenuFavorite);



favoriteRouter.get("/", getMyFavorites);

module.exports = favoriteRouter;