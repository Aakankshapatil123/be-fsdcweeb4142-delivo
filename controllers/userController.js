const { getAllRestaurants } = require("./adminController");
const Restaurant = require("../models/restaurant");
const Order = require("../models/order");
const Review = require("../models/review");
const User = require("../models/user");
const Notification = require("../models/notification");
const upload = require("../middlewares/Upload");

const userController = {
  getRestaurants: async (request, response) => {
    try {
      const restaurants = await Restaurant.find().select("-password -__v");

      return response.status(200).json({ restaurants });
    } catch (e) {
      return response.status(500).json({ message: e.message });
    }
  },

  getRestaurantById: async (request, response) => {
    try {
      const { id } = request.params;

      const restaurant = await Restaurant.findById(id);

      if (!restaurant) {
        return response.status(404).json({ message: "Restaurant not found" });
      }

      return response.status(200).json({ restaurant });
    } catch (e) {
      return response.status(500).json({ message: e.message });
    }
  },

  createOrder: async (request, response) => {
    try {
      const {
        restaurant,
        items,
        totalAmount,
        paymentMethod,
        deliveryType = "Immediate",
        scheduledDeliveryTime,
        deliveryAddress,
      } = request.body;

      if (!restaurant) {
        return response.status(400).json({
          message: "Restaurant is required",
        });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return response.status(400).json({
          message: "At least one order item is required",
        });
      }

      if (totalAmount === undefined || totalAmount === null) {
        return response.status(400).json({
          message: "Total amount is required",
        });
      }

      if (!paymentMethod) {
        return response.status(400).json({
          message: "Payment method is required",
        });
      }

      if (!deliveryAddress) {
        return response.status(400).json({
          message: "Delivery address is required",
        });
      }

      const restaurantExisting = await Restaurant.findById(restaurant);

      if (!restaurantExisting) {
        return response.status(404).json({ message: "Restaurant not found" });
      }

      if (deliveryType === "Scheduled" && !scheduledDeliveryTime) {
        return response.status(400).json({
          message: "Scheduled delivery time is required",
        });
      }

      const orderItems = items.map((item) => ({
        name: item.name,

        quantity: Number(item.quantity),

        price: Number(item.price),

        extras: Array.isArray(item.extras)
          ? item.extras.map((extra) => ({
              name: extra.name,
              price: Number(extra.price),
            }))
          : [],

        specialInstructions: item.specialInstructions?.trim() || "",
      }));

      const newOrder = new Order({
        user: request.userId,
        restaurant,
        items: orderItems,
        totalAmount: Number(totalAmount),
        paymentMethod,
        deliveryType,
        scheduledDeliveryTime:
          deliveryType === "Scheduled" ? scheduledDeliveryTime : undefined,
        deliveryAddress,
      });

      const savedOrder = await newOrder.save();

      await Notification.create({
        user: request.userId,
        message: "Your order has been placed successfully",
        type: "order",
      });

      const { __v, ...result } = savedOrder.toObject();

      return response
        .status(200)
        .json({ message: "Order place successfully", result });
    } catch (e) {
      return response.status(500).json({ message: e.message });
    }
  },

  getOrderById: async (request, response) => {
    try {
      const { id } = request.params;

      const order = await Order.findOne({
        _id: id,
        user: request.userId,
      }).populate("restaurant", "name cuisine location");

      if (!order) {
        return response.status(404).json({ message: "Order not found" });
      }

      return response
        .status(200)
        .json({ message: " Order fetched successfully", result: order });
    } catch (e) {
      return response.status(500).json({ message: e.message });
    }
  },

  getMyOrders: async (request, response) => {
    try {
      const orders = await Order.find({
        user: request.userId,
      })
        .populate("restaurant", "name cuisine location")
        .sort({ createdAt: -1 });

      return response
        .status(200)
        .json({ message: "My orders fetched successfully", result: orders });
    } catch (e) {
      return response.status(500).json({ message: e.message });
    }
  },

  cansalOrders: async (request, response) => {
    try {
      const { id } = request.params;

      const order = await Order.findById(id);

      if (!order) {
        return response.status(404).json({
          message: "Order not found",
        });
      }

      // User can cancel only their own order
      if (order.user.toString() !== request.userId) {
        return response.status(403).json({
          message: "You are not authorized to cancel this order",
        });
      }

      // Cannot cancel after delivery
      if (
        order.orderStatus === "Delivered" ||
        order.orderStatus === "Cancelled"
      ) {
        return response.status(400).json({
          message: "Order cannot be cancelled",
        });
      }

      const orderTime = new Date(order.createdAt).getTime();
      const currentTime = Date.now();

      const differenceInMinutes = (currentTime - orderTime) / (1000 * 60);

      if (differenceInMinutes >= 30) {
        return response.status(400).json({
          message: "Order cannot be cancelled after 30 minutes",
        });

        order.orderStatus = "Cancelled";

        await order.save();

        return response
          .status(200)
          .json({ message: "Order canclled successfully", result: order });
      }
    } catch (e) {
      return response.status(500).json({ message: e.message });
    }
  },

  getRestaurantReviews: async (request, response) => {
    try {
      const { id } = request.params;

      console.log("Restaurant ID received:", id);

      const restaurant = await Restaurant.findById(id);

      console.log("Restaurant found:", restaurant);

      if (!restaurant) {
        return response.status(404).json({
          message: "Restaurant not found",
        });
      }

      const reviews = await Review.find({
        restaurant: restaurant._id,
      })
        .populate("user", "name email profilePicture")
        .sort({ createdAt: -1 });

      return response.status(200).json({
        message: "Restaurant reviews fetched successfully",
        restaurant: {
          _id: restaurant._id,
          name: restaurant.name,
          image: restaurant.image,
        },
        totalReviews: reviews.length,
        result: reviews,
      });
    } catch (e) {
      console.log("Get Restaurant Reviews Error:", e);

      return response.status(500).json({
        message: e.message,
      });
    }
  },

  addReviwes: async (request, response) => {
    try {
      const { restaurant, rating, comment } = request.body;

      // Required fields
      if (!restaurant || rating === undefined || !comment) {
        return response.status(400).json({
          message: "Restaurant, rating and comment are required",
        });
      }

      // Rating validation
      if (rating < 1 || rating > 5) {
        return response.status(400).json({
          message: "Rating must be between 1 and 5",
        });
      }

      // Check restaurant exists
      const restaurantExisting = await Restaurant.findById(restaurant);

      if (!restaurantExisting) {
        return response.status(404).json({
          message: "Restaurant not found",
        });
      }

      // Check user already reviewed this restaurant
      const existingReview = await Review.findOne({
        user: request.userId,
        restaurant: restaurant,
      });

      if (existingReview) {
        return response.status(400).json({
          message: "You have already reviewed this restaurant",
        });
      }

      // Create review
      const newReview = new Review({
        user: request.userId,
        restaurant: restaurant,
        rating: Number(rating),
        comment: comment.trim(),
      });

      const saveReview = await newReview.save();

      // Get all reviews of this restaurant
      const reviews = await Review.find({
        restaurant: restaurant,
      });

      // Calculate total reviews
      const totalReviews = reviews.length;

      // Calculate average rating
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );

      const averageRating = totalRating / totalReviews;

      // Update restaurant rating
      await Restaurant.findByIdAndUpdate(restaurant, {
        rating: Number(averageRating.toFixed(1)),
        totalReviews: totalReviews,
      });

      // Remove __v from response
      const { __v, ...result } = saveReview.toObject();

      return response.status(201).json({
        message: "Review added successfully",
        result,
      });
    } catch (e) {
      return response.status(500).json({
        message: e.message,
      });
    }
  },

  getMyReviews: async (request, response) => {
    try {
      const reviews = await Review.find({
        user: request.userId,
      })
        .populate("restaurant", "name cuisine image")
        .sort({ createdAt: -1 });

      return response.status(200).json({
        message: "My reviews fetched successfully",
        result: reviews,
      });
    } catch (e) {
      return response.status(500).json({
        message: e.message,
      });
    }
  },

  updateMyReview: async (request, response) => {
    try {
      const { id } = request.params;
      const { rating, comment } = request.body;

      const review = await Review.findOne({
        _id: id,
        user: request.userId,
      });

      if (!review) {
        return response.status(404).json({
          message: "Review not found",
        });
      }

      if (rating !== undefined) {
        if (rating < 1 || rating > 5) {
          return response.status(400).json({
            message: "Rating must be between 1 and 5",
          });
        }

        review.rating = rating;
      }

      if (comment !== undefined) {
        review.comment = comment.trim();
      }

      await review.save();

      const restaurantId = review.restaurant;

      const reviews = await Review.find({
        restaurant: restaurantId,
      });

      const totalReviews = reviews.length;

      const totalRating = reviews.reduce(
        (sum, review) => sum + Number(review.rating),
        0,
      );

      const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

      // Update restaurant rating
      await Restaurant.findByIdAndUpdate(
        restaurantId,
        {
          rating: Number(averageRating.toFixed(1)),
          totalReviews: totalReviews,
        },
        {
          new: true,
        },
      );
      return response.status(200).json({
        message: "Review updated successfully",
        result: review,
      });
    } catch (e) {
      return response.status(500).json({
        message: e.message,
      });
    }
  },

  deleteMyReview: async (request, response) => {
    try {
      const { id } = request.params;

      const review = await Review.findOne({
        _id: id,
        user: request.userId,
      });

      if (!review) {
        return response.status(404).json({
          message: "Review not found",
        });
      }

      const restaurantId = review.restaurant;

      await Review.findByIdAndDelete(id);

      const reviews = await Review.find({
        restaurant: restaurantId,
      });

      const totalReviews = reviews.length;

      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );

      const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

      await Restaurant.findByIdAndUpdate(restaurantId, {
        rating: Number(averageRating.toFixed(1)),
        totalReviews: totalReviews,
      });

      return response.status(200).json({
        message: "Review deleted successfully",
      });
    } catch (e) {
      return response.status(500).json({
        message: e.message,
      });
    }
  },

  getPaymentHistory: async (request, response) => {
    try {
      const payments = await Order.find({
        user: request.userId,
      })
        .select(
          "totalAmount paymentMethod paymentStatus paymentId paymentOrderId createdAt restaurant",
        )
        .populate("restaurant", "name")
        .sort({ createdAt: -1 });

      return response.status(200).json({
        message: "Payment history fetched successfully",
        result: payments,
      });
    } catch (e) {
      return response.status(500).json({
        message: e.message,
      });
    }
  },

  updateProfile: async (request, response) => {
    try {
      const { name, phone, location, notificationEnabled } = request.body;

      const user = await User.findById(request.userId);

      if (!user) {
        return response.status(404).json({
          message: "User not found",
        });
      }

      let image = user.profilePicture || "";

      if (request.file) {
        image = `/uploads/profiles/${request.file.filename}`;
      }

      let locationData = user.location;

      if (location !== undefined) {
        try {
          locationData =
            typeof location === "string" ? JSON.parse(location) : location;
        } catch (error) {
          return response.status(400).json({
            message: "Invalid location format",
          });
        }
      }

      let notificationStatus = user.notificationEnabled ?? true;

      if (notificationEnabled !== undefined) {
        notificationStatus =
          notificationEnabled === true || notificationEnabled === "true";
      }

      const updatedUser = await User.findByIdAndUpdate(
        request.userId,
        {
          name,
          phone,
          location: locationData,
          profilePicture: image,
          notificationEnabled: notificationStatus,
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!updatedUser) {
        return response.status(404).json({
          message: "User not found",
        });
      }

      const { password, __v, ...result } = updatedUser.toObject();

      return response.status(200).json({
        message: "Profile updated successfully",
        result,
      });
    } catch (e) {
      console.log("UPDATE PROFILE ERROR:", e);

      return response.status(500).json({
        message: e.message,
      });
    }
  },
};

module.exports = userController;
