const User = require("../models/user")
const bcrypt = require("bcrypt")
const { SALT_ROUNDS, JWT_SECRATE, ENV } = require("../utils/config")
const Jwt = require("jsonwebtoken")
// const user = require("../models/user")

// setup authController as object of functions
const authController = {
    // register
    register: async (request, response) => {
        try{
            const { name, email, password } = request.body

            const existingUser = await User.findOne({email})

            if(existingUser){
                return response.status(409).json({message: "User already exists"})
            }

            const hashPassword = await bcrypt.hash(password, parseInt(SALT_ROUNDS))

            const newUser = new User({
                name,
                email,
                password: hashPassword
            })

            await newUser.save();

            // email

            return response.status(200).json({message: "User Register Successfuly"})
            
        }catch(e) {
            return response.status(500).json({message: e.message})
        }
    },
    
    // login
    login: async (request, response) => {
        try{
            const { email, password } = request.body;

            const user = await User.findOne({ email });

            if(!user){
                 return response.status(400).json({message: "Invalid email user does not exis"})
            }

            const passwordMatch = await bcrypt.compare(password, user.password)

            if(!passwordMatch){
                 return response.status(400).json({message: "Invalid Password"})
            }
           
            const token = await Jwt.sign({ userId: user._id}, JWT_SECRATE, {expiresIn: '1h'});

            response.cookie("token", token,{
                httpOnly: true,
                secure: ENV === 'production', // set secure flag only in production
                sameSite: ENV === 'production' ? 'none' : 'lax', // set sameSite flag based on environment
                maxAge: 3600000 // set cookie expiration time to 1 hour
            });
           
            return response.status(200).json({message: "Login Successfuly",
                user: {
                   id:user._id,
                   name: user.name,
                   email: user.email,
                   role: user.role,
            
                }
                
            });
        
            
        }catch(e) {
            return response.status(500).json({message: e.message})
        }
    },

    // get profile of the logged in user
    me: async (request, response) => {
        try{
            const  userId = request.userId

             const user = await User.findById(userId).select("-password -__v");

            return response.status(200).json(user)
            

            
        }catch(e) {
            return response.status(500).json({message: e.message})
        }
    },
    
    // logout
    logout: async (request, response) => {
        try{
            response.clearCookie('token', {
                httpOnly: true,
                 secure: ENV === 'production',
                sameSite: ENV === 'production' ? "none": 'lax',
                maxAge: 3600000

            })
            return response.status(200).json({message: "User logout Successfuly"})
            
        }catch(e) {
            return response.status(500).json({message: e.message})
        }
    },


}

module.exports = authController;