// setup mongodb database connection
const mongoose= require("mongoose")
const { MONGODB_URL, PORT, HOST } = require("./utils/config")
const app = require("./app")
const { error } = require("node:console")


mongoose
.connect(MONGODB_URL)
.then(() => {
    console.log("Connected to MongoDB")

    app
    .listen(PORT, HOST, () => {
        console.log(`Server is running on http://${HOST}:${PORT}`)
    })
    .on(error,(error) => {
        console.log('Error to server connecting', error.message)
    })
})
.catch((error) => {
     console.log('Error connecting to MongoDB', error.message)
})