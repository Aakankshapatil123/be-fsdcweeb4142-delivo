// import express
const express = require("express");
const authRouter = require("./routes/authRouter");
const cookieParser = require("cookie-parser");
const restaurantRouter = require("./routes/restaurantRouter");
const userController = require("./controllers/userController");
const userRouter = require("./routes/userRouter");
const restaurantOwnerRouter = require("./routes/restaurantOwnerRouter");
const paymentRouter = require("./routes/paymentRouter");

// create express application
const app = express();

// parse cookies
app.use(cookieParser());

// parse the request body as JSON
app.use(express.json());

// configure the routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/restaurant', restaurantRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/restaurantOwner", restaurantOwnerRouter)
app.use("/api/v1/payment", paymentRouter)

// export application
module.exports = app;