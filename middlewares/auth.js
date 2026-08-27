const jwt = require("jsonwebtoken");
const { JWT_SECRATE } = require("../utils/config");
const User = require("../models/user");

const isAuthenticated = async (request, response, next) => {
    const token = request.cookies && request.cookies.token;

    console.log(
    "AUTH COOKIE:",
    token ? "TOKEN EXISTS" : "NO TOKEN"
);

    if(!token){
        return response.status(401).json({message: "User is not athenticated"})
    }

    try{
         console.log("JWT SECRET EXISTS:", !!JWT_SECRATE);
        const decoded = await jwt.verify(token, JWT_SECRATE)

        console.log("JWT VERIFIED:", decoded.userId);
       

        const userId = decoded.userId

        request.userId = userId;

        next()

    }catch(e){
         console.log("JWT VERIFY ERROR:", e.message);
        return response.status(401).json({message: "Unauthoeized access"})
    }
}


const allowRoles = (roles) => {
    return async (request, response, next) => {
        const userId = request.userId;

        const user = await User.findById(userId)

        if(!user){
            return response.status(404).json({message: "User not found"});
        }

        if(!roles.includes(user.role)){
            return response.status(403).json({message: "Frobidden:you dont have the required eole(s) to the access this resource"})
        }

        request.user = user

        next();
    }
}

module.exports = {
    isAuthenticated,
    allowRoles
}