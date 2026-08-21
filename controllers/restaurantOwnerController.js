const Restaurant = require("../models/restaurant");
const Menu = require("../models/menu");
const Order = require("../models/order");
const Notification = require("../models/notification");
const Review = require("../models/review");

// HELPER FUNCTIONS

const parseJSON = (value, defaultValue) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return defaultValue;
  }
};

const parseBoolean = (value, defaultValue = true) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true" || value === "1") {
    return true;
  }

  if (value === "false" || value === "0") {
    return false;
  }

  return defaultValue;
};

// RESTAURANT OWNER CONTROLLER

const restaurantOwnerController = {
  // GET RESTAURANT PROFILE

  getRestaurantProfile: async (request, response) => {
    try {
      const restaurant = await Restaurant.find({
        owner: request.userId,
      });

      if (!restaurant) {
        return response.status(404).json({
          message: "Restaurant not found",
        });
      }

      return response.status(200).json({
        message: "Restaurant profile fetched successfully",
        result: restaurant,
      });
    } catch (error) {
      console.error("GET RESTAURANT PROFILE ERROR:", error);

      return response.status(500).json({
        message: error.message,
      });
    }
  },

  // UPDATE RESTAURANT PROFILE

  updateRestaurantProfile: async (request, response) => {
    try {
      const { id } = request.params;

      const restaurant = await Restaurant.findOne({
        _id: id,
        owner: request.userId,
      });

      if (!restaurant) {
        return response.status(404).json({
          message: "Restaurant not found",
        });
      }

      const {
        name,
        description,
        cuisine,
        location,
        openingHours,
        priceRange,
        isOpen,
      } = request.body || {};

      const updateData = {};

      if (name !== undefined) {
        updateData.name = name.trim();
      }

      if (description !== undefined) {
        updateData.description = description;
      }

      if (cuisine !== undefined) {
        updateData.cuisine = cuisine;
      }

      if (location !== undefined) {
        updateData.location = parseJSON(location, restaurant.location);
      }

      if (openingHours !== undefined) {
        updateData.openingHours = openingHours;
      }

      if (priceRange !== undefined) {
        updateData.priceRange = priceRange;
      }

      if (isOpen !== undefined) {
        updateData.isOpen = parseBoolean(isOpen, restaurant.isOpen);
      }

      // Keep old image if new image is not uploaded
      // if (request.file) {
      //   updateData.image = `/uploads/restaurants/${request.file.filename}`;
      // }

      if (request.file) {
        updateData.image = request.file.path;
      }

      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        },
      );

      return response.status(200).json({
        message: "Restaurant profile updated successfully",
        result: updatedRestaurant,
      });
    } catch (error) {
      console.error("UPDATE RESTAURANT PROFILE ERROR:", error);

      return response.status(500).json({
        message: error.message,
      });
    }
  },

  // CREATE MENU

  createMenu: async (request, response) => {
    try {
      const {
        name,
        description,
        category,
        foodType,
        price,
        isAvailable,
        extras,
        nutrition,
      } = request.body;

      // Find restaurant owned by logged-in user
      const restaurant = await Restaurant.findOne({
        owner: request.userId,
      });

      if (!restaurant) {
        return response.status(404).json({
          message: "Restaurant not found",
        });
      }

      // Name validation
      if (!name || !name.trim()) {
        return response.status(400).json({
          message: "Menu name is required",
        });
      }

      // Description validation
      if (!description || !description.trim()) {
        return response.status(400).json({
          message: "Menu description is required",
        });
      }

      // Category validation
      if (!category || !category.trim()) {
        return response.status(400).json({
          message: "Menu category is required",
        });
      }

      // Food type validation
      const validFoodTypes = ["veg", "non-veg"];

      const finalFoodType =
        foodType && foodType.trim() ? foodType.trim().toLowerCase() : "veg";

      if (!validFoodTypes.includes(finalFoodType)) {
        return response.status(400).json({
          message: "Food type must be either veg or non-veg",
        });
      }

      // Price validation
      if (price === undefined || price === "" || Number.isNaN(Number(price))) {
        return response.status(400).json({
          message: "Valid menu price is required",
        });
      }

      // Duplicate menu check
      const existingMenu = await Menu.findOne({
        restaurant: restaurant._id,
        name: name.trim(),
      });

      if (existingMenu) {
        return response.status(400).json({
          message: "Menu already exists",
        });
      }

      // Image
      // let image = "";

      // if (request.file) {
      //   image = `/uploads/menu/${request.file.filename}`;
      // }


      let image = "";

      if (request.file) {
        image = request.file.path;
      }
      // Extras
      const parsedExtras = parseJSON(extras, []);

      if (!Array.isArray(parsedExtras)) {
        return response.status(400).json({
          message: "Extras must be a valid JSON array",
        });
      }

      // Nutrition
      const parsedNutrition = parseJSON(nutrition, {});

      if (
        parsedNutrition === null ||
        Array.isArray(parsedNutrition) ||
        typeof parsedNutrition !== "object"
      ) {
        return response.status(400).json({
          message: "Nutrition must be a valid JSON object",
        });
      }

      // Create menu
      const newMenu = new Menu({
        restaurant: restaurant._id,

        name: name.trim(),

        description: description.trim(),

        category: category.trim(),

        foodType: finalFoodType,

        price: Number(price),

        image,

        isAvailable: parseBoolean(isAvailable, true),

        extras: parsedExtras,

        nutrition: parsedNutrition,
      });

      const savedMenu = await newMenu.save();

      return response.status(201).json({
        message: "Menu created successfully",
        result: savedMenu,
      });
    } catch (error) {
      console.error("CREATE MENU ERROR:", error);

      return response.status(500).json({
        message: error.message,
      });
    }
  },

  // GET ALL MENUS OF OWNER

  getAllMenu: async (request, response) => {
    try {
      const restaurants = await Restaurant.find({
        owner: request.userId,
      }).select("_id name image");

      if (!restaurants.length) {
        return response.status(404).json({
          message: "No restaurants found for this owner",
          result: [],
        });
      }

      const restaurantIds = restaurants.map((restaurant) => restaurant._id);

      const menus = await Menu.find({
        restaurant: {
          $in: restaurantIds,
        },
      })
        .populate("restaurant", "name image")
        .sort({
          createdAt: -1,
        });

      return response.status(200).json({
        message: "All restaurant menus fetched successfully",

        restaurants,

        result: menus,
      });
    } catch (error) {
      console.error("GET ALL RESTAURANT MENUS ERROR:", error);

      return response.status(500).json({
        message: error.message,
        result: [],
      });
    }
  },

  // GET SINGLE MENU

  getMenuById: async (request, response) => {
    try {
      const { id } = request.params;

      const restaurants = await Restaurant.find({
        owner: request.userId,
      }).select("_id");

      if (!restaurants.length) {
        return response.status(404).json({
          message: "Restaurant not found",
        });
      }

      const restaurantIds = restaurants.map((restaurant) => restaurant._id);

      const menu = await Menu.findOne({
        _id: id,
        restaurant: {
          $in: restaurantIds,
        },
      }).populate("restaurant", "name image");

      if (!menu) {
        return response.status(404).json({
          message: "Menu not found",
        });
      }

      return response.status(200).json({
        message: "Menu fetched successfully",
        result: menu,
      });
    } catch (error) {
      console.error("GET MENU ERROR:", error);

      return response.status(500).json({
        message: error.message,
      });
    }
  },

  // UPDATE MENU

  updateMenu: async (request, response) => {
    try {
      const { id } = request.params;

      // Get all restaurants owned by current owner
      const restaurants = await Restaurant.find({
        owner: request.userId,
      }).select("_id");

      if (!restaurants.length) {
        return response.status(404).json({
          message: "Restaurant not found",
        });
      }

      const restaurantIds = restaurants.map((restaurant) => restaurant._id);

      // Find menu only inside owner's restaurants
      const menu = await Menu.findOne({
        _id: id,
        restaurant: {
          $in: restaurantIds,
        },
      });

      if (!menu) {
        return response.status(404).json({
          message: "Menu not found or you are not authorized to update it",
        });
      }

      const {
        name,
        description,
        category,
        foodType,
        price,
        isAvailable,
        extras,
        nutrition,
      } = request.body;

      const updateData = {};

      if (name !== undefined) {
        if (!name.trim()) {
          return response.status(400).json({
            message: "Menu name cannot be empty",
          });
        }

        // Check duplicate name
        const duplicateMenu = await Menu.findOne({
          restaurant: menu.restaurant,
          name: name.trim(),
          _id: {
            $ne: id,
          },
        });

        if (duplicateMenu) {
          return response.status(400).json({
            message: "Another menu with this name already exists",
          });
        }

        updateData.name = name.trim();
      }

      if (description !== undefined) {
        if (!description.trim()) {
          return response.status(400).json({
            message: "Menu description cannot be empty",
          });
        }

        updateData.description = description.trim();
      }

      // CATEGORY

      if (category !== undefined) {
        if (!category.trim()) {
          return response.status(400).json({
            message: "Menu category cannot be empty",
          });
        }

        updateData.category = category.trim();
      }

      // FOOD TYPE

      if (foodType !== undefined) {
        const finalFoodType = foodType.trim().toLowerCase();

        if (!["veg", "non-veg"].includes(finalFoodType)) {
          return response.status(400).json({
            message: "Food type must be either veg or non-veg",
          });
        }

        updateData.foodType = finalFoodType;
      }

      // PRICE

      if (price !== undefined && price !== "") {
        if (Number.isNaN(Number(price)) || Number(price) < 0) {
          return response.status(400).json({
            message: "Valid price is required",
          });
        }

        updateData.price = Number(price);
      }

      // AVAILABLE

      if (isAvailable !== undefined) {
        updateData.isAvailable = parseBoolean(isAvailable, menu.isAvailable);
      }

      // EXTRAS

      if (extras !== undefined) {
        const parsedExtras = parseJSON(extras, menu.extras || []);

        if (!Array.isArray(parsedExtras)) {
          return response.status(400).json({
            message: "Extras must be a valid JSON array",
          });
        }

        updateData.extras = parsedExtras;
      }

      // NUTRITION

      if (nutrition !== undefined) {
        const parsedNutrition = parseJSON(nutrition, menu.nutrition || {});

        if (
          parsedNutrition === null ||
          Array.isArray(parsedNutrition) ||
          typeof parsedNutrition !== "object"
        ) {
          return response.status(400).json({
            message: "Nutrition must be a valid JSON object",
          });
        }

        updateData.nutrition = parsedNutrition;
      }

      // IMAGE

      // if (request.file) {
      //   updateData.image = `/uploads/menu/${request.file.filename}`;
      // }

      if (request.file) {
        updateData.image = request.file.path;
      }

      // UPDATE

      const updatedMenu = await Menu.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate("restaurant", "name image");

      return response.status(200).json({
        message: "Menu updated successfully",
        result: updatedMenu,
      });
    } catch (error) {
      console.error("UPDATE MENU ERROR:", error);

      return response.status(500).json({
        message: error.message,
      });
    }
  },

  // DELETE MENU

  deleteMenu: async (request, response) => {
    try {
      const { id } = request.params;

      const restaurants = await Restaurant.find({
        owner: request.userId,
      }).select("_id");

      if (!restaurants.length) {
        return response.status(404).json({
          message: "Restaurant not found",
        });
      }

      const restaurantIds = restaurants.map((restaurant) => restaurant._id);

      const menu = await Menu.findOne({
        _id: id,
        restaurant: {
          $in: restaurantIds,
        },
      });

      if (!menu) {
        return response.status(404).json({
          message: "Menu not found or you are not authorized to delete it",
        });
      }

      const deletedMenu = await Menu.findByIdAndDelete(id);

      return response.status(200).json({
        message: "Menu deleted successfully",
        result: deletedMenu,
      });
    } catch (error) {
      console.error("DELETE MENU ERROR:", error);

      return response.status(500).json({
        message: error.message,
      });
    }
  },

  // GET RESTAURANT ORDERS

  getRestaurantOrder: async (request, response) => {
    try {
      const restaurants = await Restaurant.find({
        owner: request.userId,
      }).select("_id");

      if (!restaurants.length) {
        return response.status(404).json({
          message: "Restaurant not found",
          result: [],
        });
      }

      const restaurantIds = restaurants.map((restaurant) => restaurant._id);

      const orders = await Order.find({
        restaurant: {
          $in: restaurantIds,
        },
      }).sort({
        createdAt: -1,
      });

      return response.status(200).json({
        message: "Restaurant orders fetched successfully",
        result: orders,
      });
    } catch (error) {
      console.error("GET RESTAURANT ORDERS ERROR:", error);

      return response.status(500).json({
        message: error.message,
      });
    }
  },

  // UPDATE ORDER STATUS

  updateOrderStatus: async (request, response) => {
    try {
      const { id } = request.params;
      const { orderStatus } = request.body;

      if (!orderStatus) {
        return response.status(400).json({
          message: "Order status is required",
        });
      }

      const restaurants = await Restaurant.find({
        owner: request.userId,
      }).select("_id");

      if (!restaurants.length) {
        return response.status(404).json({
          message: "Restaurant not found",
        });
      }

      const restaurantIds = restaurants.map((restaurant) => restaurant._id);

      const order = await Order.findOne({
        _id: id,
        restaurant: {
          $in: restaurantIds,
        },
      });

      if (!order) {
        return response.status(404).json({
          message: "Order not found",
        });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        {
          orderStatus,
        },
        {
          new: true,
          runValidators: true,
        },
      );

      // Send notification to customer
      if (order.user) {
        await Notification.create({
          user: order.user,
          message: `Your order status is now ${orderStatus}`,
          type: "order",
        });
      }

      return response.status(200).json({
        message: "Order status updated successfully",
        result: updatedOrder,
      });
    } catch (error) {
      console.error("UPDATE ORDER STATUS ERROR:", error);

      return response.status(500).json({
        message: error.message,
      });
    }
  },

  // GET RESTAURANT REVIEWS

  getRestaurantReviews: async (request, response) => {
    try {
      const restaurants = await Restaurant.find({
        owner: request.userId,
      }).select("_id");

      if (!restaurants.length) {
        return response.status(404).json({
          message: "Restaurant not found",
          result: [],
        });
      }

      const restaurantIds = restaurants.map((restaurant) => restaurant._id);

      const reviews = await Review.find({
        restaurant: {
          $in: restaurantIds,
        },
      })
        .populate("user", "name email")
        .populate("restaurant", "name")
        .sort({
          createdAt: -1,
        });

      return response.status(200).json({
        message: "Restaurant reviews fetched successfully",
        result: reviews,
      });
    } catch (error) {
      console.error("GET RESTAURANT REVIEWS ERROR:", error);

      return response.status(500).json({
        message: error.message,
      });
    }
  },

  // REPLY TO REVIEW

  replyToReview: async (request, response) => {
    try {
      const { id } = request.params;

      const { restaurantReply } = request.body;

      if (!restaurantReply || !restaurantReply.trim()) {
        return response.status(400).json({
          message: "Restaurant reply is required",
        });
      }

      const restaurants = await Restaurant.find({
        owner: request.userId,
      }).select("_id");

      if (!restaurants.length) {
        return response.status(404).json({
          message: "Restaurant not found",
        });
      }

      const restaurantIds = restaurants.map((restaurant) => restaurant._id);

      const review = await Review.findOne({
        _id: id,
        restaurant: {
          $in: restaurantIds,
        },
      });

      if (!review) {
        return response.status(404).json({
          message: "Review not found",
        });
      }

      review.restaurantReply = restaurantReply.trim();

      const updatedReview = await review.save();

      return response.status(200).json({
        message: "Review reply added successfully",
        result: updatedReview,
      });
    } catch (error) {
      console.error("REPLY TO REVIEW ERROR:", error);

      return response.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = restaurantOwnerController;
