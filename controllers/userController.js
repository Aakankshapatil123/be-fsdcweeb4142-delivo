const { getAllRestaurants } = require("./adminController")
const Restaurant = require("../models/restaurant")
const Order = require("../models/order");
const Review = require("../models/review")
const User = require("../models/user")

const userController = {
    getRestaurants: async (request, response) => {
        try{
            const restaurant = await Restaurant.find().select("-password -__v");

            return response.status(200).json({message: restaurant})
        }catch(e) {
         return response.status(500).json({message: e.message})
        }
    },

    getRestaurantById: async (request, response) => {
        try{
            const { id } = request.params;

            const restaurant = await Restaurant.findById(id);

             if(!restaurant){
                return response.status(404).json({message: "Restaurant not found"})
            }

            return response.status(200).json({message: restaurant})
        }catch(e) {
         return response.status(500).json({message: e.message})
        }
    },

    createOrder: async (request, response) => {
        try{
           const {restaurant,  items, totalAmount, paymentMethod, deliveryType, scheduledDeliveryTime, deliveryAddress } = request.body;

           const restaurantExisting = await Restaurant.findById(restaurant);
           
            if(!restaurantExisting){
                return response.status(404).json({message: "Restaurant not found"})
            }

            const newOrder = new Order({
                user:request.userId,
                restaurant,  
                items, 
                totalAmount, 
                paymentMethod, 
                deliveryType, 
                scheduledDeliveryTime, 
                deliveryAddress
            });

            const savedOrder = await newOrder.save();

            const {__v, ...result} = savedOrder.toObject();

            return response.status(200).json({message: "Order place successfully", result})
        }catch(e) {
         return response.status(500).json({message: e.message})
        }
    },

    getOrderById: async (request, response) => {
        try{
            const { id } = request.params

            const order = await Order.findById({
                _id: id,
                user: request.userId
            })  
            .populate("restaurant", "name cuisine location")        
            

             if (!order) {
                 return response.status(404).json({ message: "Order not found" });
                }

            return response.status(200).json({message: " Order fetched successfully", result: order})
        }catch(e) {
         return response.status(500).json({message: e.message})
        }
    },

    getMyOrders: async (request, response) => {
        try{
            const orders = await Order.find({
                user: request.userId
            })  
            .populate("restaurant", "name cuisine location")
            .sort({ createdAt: -1}) ;        

            return response.status(200).json({message: "My orders fetched successfully", result: orders})
        }catch(e) {
         return response.status(500).json({message: e.message})
        }
    },

    cansalOrders: async (request, response) => {
        try{
           const { id } = request.params

           const order = await Order.findById(id);

            if (!order) {
            return response.status(404).json({
                message: "Order not found"
            });
        }

        // User can cancel only their own order
        if (order.user.toString() !== request.userId) {
            return response.status(403).json({
                message: "You are not authorized to cancel this order"
            });
        }

        // Cannot cancel after delivery 
        if(
            order.orderStatus === "Delivered" || 
            order.orderStatus === "Cancelled"
        ) {
             return response.status(400).json({
                message: "Order cannot be cancelled"
            });
        }


        order.orderStatus = 'Cancelled';

        await order.save();

            return response.status(200).json({message: "Order canclled successfully", result: order})
        }catch(e) {
         return response.status(500).json({message: e.message})
        }
    },

    
    addReviwes: async (request, response) => {
        try{
               const { restaurant, rating, comment } = request.body
               
               const restaurantExisting = await Restaurant.findById(restaurant);

               if (!restaurantExisting ) {
                  return response.status(404).json({
                     message: "Restaurant not found"
                  });
                }

                const existingReview = await Review.findOne({
                    user: request.userId,
                    restaurant
                })

                if (existingReview) {
                    return response.status(400).json({
                       message: "You have already reviewed this restaurant"
                    });
                }

                const newReview = new Review({
                    user: request.userId,
                    restaurant,
                    rating,
                    comment
                })

                const saveReview = await newReview.save();

                const {__v, ...result } = saveReview.toObject();
                return response.status(201).json({message: "Reviews added successfuly", result})
        }catch(e) {
         return response.status(500).json({message: e.message})
        }
    },


    updateProfile: async (request, response) => {
        try{
            const { name, phone, profilePicture, location, notificationEnabled } = request.body

            const user = await User.findById(request.userId)

             if (!user) {
            return response.status(404).json({ message: "User not found"});
        }

        const updateProfile = await User.findByIdAndUpdate(
            user._id,
            {
            name, 
            phone, 
            profilePicture, 
            location, 
            notificationEnabled
        }, {new:user})

         const { password, __v, ...result } = updateProfile.toObject();

            return response.status(200).json({message: result})
        }catch(e) {
         return response.status(500).json({message: e.message})
        }
    },

    
}

module.exports = userController