// const jwt = require("jsonwebtoken");
// const { JWT_SECRATE } = require("../utils/config");
// const User = require("../models/user");

// const isAuthenticated = async (request, response, next) => {
//     // const token = request.cookies && request.cookies.token;

//     const authHeader = request.headers.authorization;

// if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return response.status(401).json({
//         message: "User is not authenticated"
//     });
// }

// const token = authHeader.split(" ")[1];

//     console.log(
//     "AUTH COOKIE:",
//     token ? "TOKEN EXISTS" : "NO TOKEN"
// );

//     if(!token){
//         return response.status(401).json({message: "User is not athenticated"})
//     }

//     try{
//          console.log("JWT SECRET EXISTS:", !!JWT_SECRATE);
//         const decoded = await jwt.verify(token, JWT_SECRATE)

//         console.log("JWT VERIFIED:", decoded.userId);
       

//         const userId = decoded.userId

//         request.userId = userId;

//         next()

//     }catch(e){
//          console.log("JWT VERIFY ERROR:", e.message);
//         return response.status(401).json({message: "Unauthoeized access"})
//     }
// }


// const allowRoles = (roles) => {
//     return async (request, response, next) => {
//         const userId = request.userId;

//         const user = await User.findById(userId)

//         if(!user){
//             return response.status(404).json({message: "User not found"});
//         }

//         if(!roles.includes(user.role)){
//             return response.status(403).json({message: "Frobidden:you dont have the required eole(s) to the access this resource"})
//         }

//         request.user = user

//         next();
//     }
// }

// module.exports = {
//     isAuthenticated,
//     allowRoles
// }




const jwt = require("jsonwebtoken");
const { JWT_SECRATE } = require("../utils/config");
const User = require("../models/user");

const isAuthenticated = async (request, response, next) => {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return response.status(401).json({
                message: "User is not authenticated"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return response.status(401).json({
                message: "User is not authenticated"
            });
        }

        console.log("AUTH HEADER: TOKEN EXISTS");
        console.log("JWT SECRET EXISTS:", !!JWT_SECRATE);

        const decoded = jwt.verify(token, JWT_SECRATE);

        console.log("JWT VERIFIED:", decoded);

        request.userId = decoded.userId;

        next();

    } catch (error) {
        console.log("JWT VERIFY ERROR:", error.message);

        return response.status(401).json({
            message: "Unauthorized access"
        });
    }
};


const allowRoles = (roles) => {
    return async (request, response, next) => {
        try {
            const user = await User.findById(request.userId);

            if (!user) {
                return response.status(404).json({
                    message: "User not found"
                });
            }

            console.log("USER ROLE:", user.role);
            console.log("ALLOWED ROLES:", roles);

            if (!roles.includes(user.role)) {
                return response.status(403).json({
                    message: "Forbidden: You don't have the required role"
                });
            }

            request.user = user;

            next();

        } catch (error) {
            console.log("ROLE CHECK ERROR:", error.message);

            return response.status(500).json({
                message: "Server error while checking role"
            });
        }
    };
};

module.exports = {
    isAuthenticated,
    allowRoles
};