const Restaurant = require("../models/restaurant");
const Menu = require("../models/menu");

const restaurantListingController = {

    // Get all restaurants
    getAllRestaurants: async (request, response) => {
        try {

            const restaurants = await Restaurant.find();

            return response.status(200).json({
                message: "Restaurants fetched successfully",
                restaurants
            });

        } catch (e) {

            return response.status(500).json({
                message: e.message
            });

        }
    },


    // Get restaurant by ID
    getRestaurantById: async (request, response) => {
        try {

            const { id } = request.params;

            const restaurant = await Restaurant.findById(id);

            if (!restaurant) {
                return response.status(404).json({
                    message: "Restaurant not found"
                });
            }

            return response.status(200).json({
                message: "Restaurant fetched successfully",
                restaurant
            });

        } catch (e) {

            return response.status(500).json({
                message: e.message
            });

        }
    },


    // Get restaurant menu
    getRestaurantMenu: async (request, response) => {
    try {
        const { id } = request.params;

        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return response.status(404).json({
                message: "Restaurant not found"
            });
        }

        const menus = await Menu.find({
            restaurant: restaurant._id
        }).sort({ createdAt: -1 });

        return response.status(200).json({
            message: "Menu fetched successfully",
            menus
        });

    } catch (e) {
        return response.status(500).json({
            message: e.message
        });
    }
}

};

module.exports = restaurantListingController;