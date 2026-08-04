const jwt = require("jsonwebtoken");
const { JWT_SECRATE } = require("../utils/config");
const User = require("../models/user");

const isAuthenticated = async (request, response, next) => {
    const token = request.cookies && request.cookies.token;

    if(!token){
        return response.status(401).json({message: "User is not athenticated"})
    }

    try{
        const decoded = await jwt.verify(token, JWT_SECRATE)

        const userId = decoded.userId

        request.userId = userId;

        next()

    }catch(e){
        return response.status(401).json({message: "Unauthoeized access"})
    }
}


const allowRoles = (roles) => {
    return async (request, ressponse, next) => {
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