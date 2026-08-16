const Favorite = require("../models/favrite");
const Restaurant = require("../models/restaurant");
const Menu = require("../models/menu");


const favoriteController = {
  //  ADD RESTAURANT TO FAVORITES 

  addRestaurantFavorite: async (request, response) => {
    try {
      const { restaurantId } = request.body;

      if (!restaurantId) {
        return response.status(400).json({
          message: "Restaurant ID is required",
        });
      }

      const restaurant =
        await Restaurant.findById(restaurantId);

      if (!restaurant) {
        return response.status(404).json({
          message: "Restaurant not found",
        });
      }

      const existingFavorite =
        await Favorite.findOne({
          user: request.userId,
          restaurant: restaurantId,
        });

      if (existingFavorite) {
        return response.status(400).json({
          message: "Restaurant already added to favorites",
        });
      }

      const favorite = await Favorite.create({
        user: request.userId,
        restaurant: restaurantId,
        menu: null,
      });

      return response.status(201).json({
        message: "Restaurant added to favorites",
        result: favorite,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message,
      });
    }
  },

  //  REMOVE RESTAURANT FROM FAVORITES 

  removeRestaurantFavorite: async (request, response) => {
    try {
      const { restaurantId } = request.params;

      const favorite =
        await Favorite.findOneAndDelete({
          user: request.userId,
          restaurant: restaurantId,
        });

      if (!favorite) {
        return response.status(404).json({
          message: "Restaurant favorite not found",
        });
      }

      return response.status(200).json({
        message: "Restaurant removed from favorites",
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message,
      });
    }
  },

  //  ADD MENU TO FAVORITES 

  addMenuFavorite: async (request, response) => {
    try {
      const { menuId } = request.body;

      if (!menuId) {
        return response.status(400).json({
          message: "Menu ID is required",
        });
      }

      const menu = await Menu.findById(menuId);

      if (!menu) {
        return response.status(404).json({
          message: "Menu item not found",
        });
      }

      const existingFavorite =
        await Favorite.findOne({
          user: request.userId,
          menu: menuId,
        });

      if (existingFavorite) {
        return response.status(400).json({
          message: "Menu item already added to favorites",
        });
      }

      const favorite = await Favorite.create({
        user: request.userId,
        restaurant: null,
        menu: menuId,
      });

      return response.status(201).json({
        message: "Menu item added to favorites",
        result: favorite,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message,
      });
    }
  },

  //  REMOVE MENU FROM FAVORITES 

  removeMenuFavorite: async (request, response) => {
    try {
      const { menuId } = request.params;

      const favorite =
        await Favorite.findOneAndDelete({
          user: request.userId,
          menu: menuId,
        });

      if (!favorite) {
        return response.status(404).json({
          message: "Menu favorite not found",
        });
      }

      return response.status(200).json({
        message: "Menu item removed from favorites",
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message,
      });
    }
  },

  //  GET USER FAVORITES 

  getMyFavorites: async (request, response) => {
    try {
      const favorites = await Favorite.find({
        user: request.userId,
      })
        .populate("restaurant")
        .populate("menu")
        .sort({ createdAt: -1 });

      return response.status(200).json({
        message: "Favorites fetched successfully",
        favorites,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message,
      });
    }
  },

  //  CHECK RESTAURANT FAVORITE 

  checkRestaurantFavorite: async (request, response) => {
    try {
      const { restaurantId } = request.params;

      const favorite =
        await Favorite.findOne({
          user: request.userId,
          restaurant: restaurantId,
        });

      return response.status(200).json({
        isFavorite: Boolean(favorite),
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message,
      });
    }
  },

  // CHECK MENU FAVORITE 

  checkMenuFavorite: async (request, response) => {
    try {
      const { menuId } = request.params;

      const favorite =
        await Favorite.findOne({
          user: request.userId,
          menu: menuId,
        });

      return response.status(200).json({
        isFavorite: Boolean(favorite),
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = favoriteController;