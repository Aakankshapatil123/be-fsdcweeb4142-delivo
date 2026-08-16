const Notification = require("../models/notification")

const notificationController = { 
    getMyNotifications: async (request, response) => {
        try{
            const notifications = await Notification.find({
                user: request.userId
            })
            .sort({ createdAt: -1})

            return response.status(200).json({
                message: "Notifications fetched successfully",
                result: notifications
            });

        }catch(e) {
            return response.status(500).json({message: e.message})
        }
    },


    markAsRead: async (request, response) => {
        try{
            const notifications = await Notification.findOneAndUpdate({
                _id: request.params.id,
                user: request.userId
            },

            {
               isRead: true
            },

            {
                new: true
            }
            );

            if (!notifications) {
                return response.status(404).json({
                    message: "Notification not found"
                });
            }
           

            return response.status(200).json({
                message: "Notifications  marked as read",
                result: notifications
            });

        }catch(e) {
            return response.status(500).json({message: e.message})
        }
    },


}

module.exports = notificationController