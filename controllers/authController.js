
// setup authController as object of functions
const authController = {
    // register
    register: async (request, response) => {
        try{
            return response.status(200).json({message: "Register Successfuly"})
            
        }catch(e) {
            return response.status(500).json({message: e.message})
        }
    },
    
    // login
    login: async (request, response) => {
        try{
            return response.status(200).json({message: "Login Successfuly"})
            
        }catch(e) {
            return response.status(500).json({message: e.message})
        }
    },

    // get profile of the logged in user
    me: async (request, response) => {
        try{
            return response.status(200).json({message: "Me Successfully"})
            
        }catch(e) {
            return response.status(500).json({message: e.message})
        }
    },
    
    // logout
    logout: async (request, response) => {
        try{
            return response.status(200).json({message: "logout Successfuly"})
            
        }catch(e) {
            return response.status(500).json({message: e.message})
        }
    },


}

module.exports = authController;