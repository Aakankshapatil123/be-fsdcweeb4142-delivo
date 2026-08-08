const Restaurant = require("../models/restaurant")
const Menu = require("../models/menu")
const Order = require("../models/order");


const restaurantOwnerController = {
    getRestaurantProfile: async (request, response) => {
       try{
          
        const restaurant = await Restaurant.findOne({
            owner: request.userId
        });
          
         
           if (!restaurant) {
            return response.status(404).json({
                message: "Restaurant not found"
            });
        }

         return response.status(200).json({ message: "Restaurant profile fetched successfully",result: restaurant });

       }catch(e) {
         return response.status(500).json({message: e.message})
       }
    },

    updateRestaurantProfile: async (request, response) => {
       try{
        const { name, description, cuisine, location, openingHours, image, priceRange, isOpen } = request.body
        
        const restaurant = await Restaurant.findOne({
            owner: request.userId
        });

        if(!restaurant) {
            return response.status(401).json({message: "Restaurant not found"})
        }
        
        const updateProfile = await Restaurant.findByIdAndUpdate(
            restaurant._id,
            {
            name, 
            description, 
            cuisine, 
            location, 
            openingHours, 
            image, 
            priceRange, 
            isOpen
        }, {new: true})
 

        return response.status(200).json({ message: "Profile update successfully",result: updateProfile });

       }catch(e) {
         return response.status(500).json({message: e.message})
       }
    },

    createMenu: async (request, response) => {
       try{
            const { name, description, category, price, image,  isAvailable } = request.body

            const restaurant = await Restaurant.findOne({ 
                owner: request.userId
             });

            if(!restaurant){
                return response.status(403).json({message: "Restaurant not found"})
            }

            const menuExisting = await Menu.findOne({ restaurant: restaurant._id, name });

            if (menuExisting) { 
                return response.status(400).json({ message: "Menu already exists" });
        }

            const newMenu = new Menu({
                restaurant: restaurant._id, 
                name, 
                description, 
                category, 
                price, 
                image,  
                isAvailable
            })

            const savedMenu = await newMenu.save();

             const { password, __v, ...result } = savedMenu.toObject();

        return response.status(200).json({ message: "Menu create successfuly",result: savedMenu });

       }catch(e) {
         return response.status(500).json({message: e.message})
       }
    },

    getAllMenu: async (request, response) => {
       try{
            const restaurant = await Restaurant.findOne({
            owner: request.userId
        });

        if (!restaurant) { return response.status(404).json({ message: "Restaurant not found" });
        }

        const menus = await Menu.find({
            restaurant: restaurant._id
        });


        return response.status(200).json({ message:  "Menus fetched successfully", menus });

       }catch(e) {
         return response.status(500).json({message: e.message})
       }
    },


    updateMenu: async (request, response) => {
       try{
           const { id } = request.params

           const { name, description, category, price, image, isAvailable } = request.body;

           const restaurant = await Restaurant.findOne({ 
            owner: request.userId 
           });

           if (!restaurant) {
              return response.status(404).json({ message: "Restaurant not found" });
            }

            const menu = await Menu.findOne({
              _id: id,
               restaurant: restaurant._id
            });

            if (!menu) {
              return response.status(404).json({ message: "Menu not found" });
            }

            const updateMenu = await Menu.findByIdAndUpdate(
               id,
            {
               name, 
               description, 
               category, 
               price, 
               image, 
               isAvailable
            }, {new:true})

            return response.status(200).json({ message:  "Menus update successfully", updateMenu });

       }catch(e) {
         return response.status(500).json({message: e.message})
       }
    },
    

    deleteMenu: async (request, response) => {
       try{
        const { id } = request.params

        const restaurant = await Restaurant.findOne({ owner: request.userId });

         console.log("RESTAURANT:", restaurant);
        if (!restaurant) {
            return response.status(404).json({ message: "Restaurant not found" });
        }

        
        const menu = await Menu.findOne({
            _id: id,
            restaurant: restaurant._id
        })

        
        if (!menu) {
            return response.status(404).json({ message: "Menu not found" });
        }

        const deleteMenu = await Menu.findByIdAndDelete(id);

        return response.status(200).json({ message:  "Menus delete successfully", result: deleteMenu });

       }catch(e) {
         return response.status(500).json({message: e.message})
       }
    },
    

    getRestaurantOrder: async (request, response) => {
       try{
        const restaurant = await Restaurant.findOne({ owner: request.userId });   
        
        if (!restaurant) {
            return response.status(404).json({ message: "Restaurant not found" });
        }

        const orders = await Order.find({
            restaurant: restaurant._id
        })

        return response.status(200).json({ message:  "Restaurant orders fetched successfully", result: orders });

       }catch(e) {
         return response.status(500).json({message: e.message})
       }
    },


    updateOrderStatus: async (request, response) => {
       try{
        const { id } = request.params
        const { orderStatus } = request.body;

        const restaurant = await Restaurant.findOne({ owner: request.userId });   
        
        if (!restaurant) {
            return response.status(404).json({ message: "Restaurant not found" });
        }

        const order = await Order.findOne({
            _id:id,
            restaurant: restaurant._id
        })

        if (!order) {
            return response.status(404).json({ message: "Order not found" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            {
                orderStatus
            },
            {
                new: true,
                runValidators: true
            }
        );

        return response.status(200).json({ message:  "Order status updated successfully", result: updatedOrder });

       }catch(e) {
         return response.status(500).json({message: e.message})
       }
    },






}

module.exports = restaurantOwnerController