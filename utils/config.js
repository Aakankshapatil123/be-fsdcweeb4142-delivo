require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL
const ENV = process.env.ENV
const HOST = process.env.HOST
const PORT = process.env.PORT
const SALT_ROUNDS= process.env.SALT_ROUNDS
const JWT_SECRATE= process.env.JWT_SECRATE
const RAZORPAY_KEY_ID= process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET= process.env.RAZORPAY_KEY_SECRET

const CLOUDINARY_CLOUD_NAME=process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY=process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET=process.env.CLOUDINARY_API_SECRET


module.exports = {
    MONGODB_URL,
    ENV,
    HOST,
    PORT,
    SALT_ROUNDS,
    JWT_SECRATE,
    RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET,

    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
}