require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL
const ENV = process.env.ENV
const HOST = process.env.HOST
const PORT = process.env.PORT

module.exports = {
    MONGODB_URL,
    ENV,
    HOST,
    PORT
}