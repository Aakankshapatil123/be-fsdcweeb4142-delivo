const { response } = require("../app")
const  Restaurant  = require("../models/restaurant")
const User = require("../models/user")
const Order = require("../models/order")
const Review = require("../models/review")


const adminController = {
  createRestaurant : async (request, response) => {
    try{
        // get name description cuisine location openingHours to the reques body
        const {   name, description, cuisine, location, openingHours, priceRange } =request.body

        const restaurantExists = await Restaurant.findOne({name});

         // Get uploaded restaurant image
        const image = request.file
            ? `/uploads/restaurants/${request.file.filename}`
            : "";

        if(restaurantExists){
            return response.status(400).json({message: "Restaurant alrady exist"})
        }

        const newRestaurant = new Restaurant({
            name, 
            description, 
            cuisine, 
            location, 
            openingHours, 
            image:image,
            priceRange,
            owner: request.user._id
        })

        const savedRestauranr = await newRestaurant.save()

        const {__v, ...result} = savedRestauranr.toObject();


        return response.status(200).json({message: "Restaurant created successfuly", result})

    }catch(e){
         return response.status(500).json({message: e.message})
    }
  },

   getAllRestaurants: async (request, response) => {
    try{
        const restaurants = await Restaurant.find();

        return response.status(200).json({restaurants})

    }catch(e){
         return response.status(500).json({message: e.message})
    }
  },

   // to get a single company
    getRestaurantById: async (request, response) => {
        try {
            //  name description cuisine location openingHours
            const { id } = request.params

            const restaurant = await Restaurant.findById(id)

            if(!restaurant){
                return response.status(404).json({message: "Restaurant not found"})
            }

            return response.status(200).json({restaurant});
        } catch (e) {
    
            return response.status(500).json({ message: e.message });
        }
    },
    // to update a company
    updateRestaurants: async (request, response) => {
        try {
              const { id } = request.params

              const { name, description, cuisine, location, openingHours, image, priceRange,owner } = request.body

              const updateRestaurant = await Restaurant.findByIdAndUpdate(id, {
                name, 
                description, 
                cuisine, 
                location, 
                openingHours, 
                image, 
                priceRange, 
            }, {new:true}) 
            return response.status(200).json({ message: "update company endpoint", result: updateRestaurant });
        } catch (e) {
            return response.status(500).json({ message: e.message });
        }
    },
    // to delete a company
    deleteRestaurants: async (request, response) => {
        try {
            const { id } = request.params

            const deleteRestaurant = await Restaurant.findByIdAndDelete(id)

            if(!deleteRestaurant){
                return response.status(404).json({ message: "Restaurant not found" });
            }
            return response.status(200).json({ message: "delete Restaurant endpoint", result:deleteRestaurant});
        } catch (e) {
            return response.status(500).json({ message: e.message });
        }
    },

    getAllUsers: async (request, response) => {
        try {
            const users = await User.find().select("-password -__v");

            return response.status(200).json({ message: "Users fetched successfully", result: users });
        } catch (e) {
            return response.status(500).json({ message: e.message });
        }
    },

    getUserById: async (request, response) => {
        try {
            const { id } = request.params

            const user = await User.findById(id);

            if(!user){
                return response.status(403).json({ message: "User not found" });
            }

            return response.status(200).json({ result: user});
        } catch (e) {
            return response.status(500).json({ message: e.message });
        }
    },

    deleteUser: async (request, response) => {
        try {
            const { id } = request.params;
            
            const deleteUser = await User.findById(id);

            return response.status(200).json({ message: "delete company endpoint" });
        } catch (e) {
            return response.status(500).json({ message: e.message });
        }
    },

    getAllOrders: async (request, response) => {
        try {
            const orders = await Order.find().select("-password -__v")
            .populate("user", "name email")
            .populate("restaurant", "name cuisine")
            .sort({ createdAt: -1 });

            return response.status(200).json({ orders });
        } catch (e) {
            return response.status(500).json({ message: e.message });
        }
    },
    
  
    getOrderById: async (request, response) => {
        try {
            const { id } = request.params
            
            const order = await Order.findById(id);

            if(!order) {
                return response.status(401).json({ message: "Order not found" });
            }

            return response.status(200).json({  message: "Order fetched successfully",result: order });
        } catch (e) {
            return response.status(500).json({ message: e.message });
        }
    },

    updateOrderStatus: async (request, response) => {
        try {
            const { id } = request.params;

            const { orderStatus } = request.body
            
            const order = await Order.findById(id);

            if (!order) {
                return response.status(404).json({
                   message: "Order not found"
               });
            }

            order.orderStatus = orderStatus;

            await order.save();

            return response.status(200).json({ message: "Order status updated successfully", result: order });
        } catch (e) {
            return response.status(500).json({ message: e.message });
        }
    },

    getAllReviews: async (request, response) => {
        try {
            const reviews = await Review.find()
            .populate("user", "name email")
            .populate("restaurant", "name cuisine")

            return response.status(200).json({ message: "Reviews fetched successfuly", result:reviews });
        } catch (e) {
            return response.status(500).json({ message: e.message });
        }
    },

     deleteReview: async (request, response) => {
        try {
             const { id } = request.params;

             const review = await Review.findByIdAndDelete(id);

             return response.status(200).json({ message: "delete review successfuly", result: review });
        } catch (e) {
            return response.status(500).json({ message: e.message });
        }
    },
    
    getDashboardStatistics: async (request, response) => {
        try {
            const totalUsers = await User.countDocuments({
                role: "user"
            })

            const totalRestaurants = await Restaurant.countDocuments();

            const totalOrders = await Order.countDocuments();

            const pendingOrders = await Order.countDocuments({
                orderStatus: "Pending"
            });

            const deliveregOrders = await Order.countDocuments({
                orderStatus: "Delivered"
            });

            const cancleOrders = await Order.countDocuments({
                orderStatus: "Cancelled"
            });

            const revenueResult = await Order.aggregate([
            {
                $match: {
                    paymentStatus: "Paid"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        return response.status(200).json({
            message: "Dashboard statistics fetched successfully",
            result: {
                totalUsers,
                totalRestaurants,
                totalOrders,
                totalRevenue,
                pendingOrders,
                deliveregOrders,
                cancleOrders
            }
        });
        } catch (e) {
            return response.status(500).json({ message: e.message });
        }
    },

    
   
}   

module.exports = adminController