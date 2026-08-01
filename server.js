// setup mongodb database connection
const mongoose= require("mongoose")
const { MONGODB_URL } = require("./utils/config")


mongoose
.connect(MONGODB_URL)
.then(() => {
    console.log("Connected to MongoDB")
})
.catch((error) => {
     console.log('Error connecting to MongoDB', error.message)
})