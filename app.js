// import express
const express = require("express");
const authRouter = require("./routes/authRouter");
const cookieParser = require("cookie-parser");
const restaurantRouter = require("./routes/restaurantRouter");
const userController = require("./controllers/userController");
const userRouter = require("./routes/userRouter");
const restaurantOwnerRouter = require("./routes/restaurantOwnerRouter");
const paymentRouter = require("./routes/paymentRouter");
const notificationRouter = require("./routes/notificationRouter");
const cros = require("cors");
const restaurantListingRouter = require("./routes/restaurantListingRouter");
const favoriteRouter = require("./routes/favoriteRouter");

// create express application
const app = express();

// enable static files for uploads
app.use("/uploads", express.static('uploads'))

// enable cros
app.use(cros({
    origin: "http://fe-fsdcweeb4142-delivo.netlify.app",//repace with your frontend URL
    credentials: true //allow cookies to be sent
}))

// parse cookies
app.use(cookieParser());

// parse the request body as JSON
app.use(express.json());

// configure the routes
app.use('/api/v1/auth', authRouter)
app.use("/api/v1/restaurants", restaurantListingRouter);
app.use('/api/v1/restaurant', restaurantRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/restaurantOwner", restaurantOwnerRouter)
app.use("/api/v1/payment", paymentRouter)
app.use("/api/v1/notifications", notificationRouter)
app.use("/api/v1/favorites", favoriteRouter);


// export application
module.exports = app;