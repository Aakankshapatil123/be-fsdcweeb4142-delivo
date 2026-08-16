const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
        
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type:String
    },

    role: {
        type: String,
        enum: ['user', "restaurant", "admin"],
        default: "user"
    },

    profilePicture: {
        type: String,
        default: ""
    },

    location: {
        address: String,
        city: String,
        state: String,
        pincode: String
        
    },


    isVerified: {
        type: Boolean,
        default: false
    },
    
    notificationEnabled: {
        type: Boolean,
        default: true
    }
    

}, {timestamps: true})

module.exports = mongoose.model("User", userSchema, "users")




