// import express
const express = require("express");
const authRouter = require("./routes/authRouter");
const cookieParser = require("cookie-parser")

// create express application
const app = express();

// parse cookies
app.use(cookieParser());

// parse the request body as JSON
app.use(express.json());

// configure the routes
app.use('/api/v1/auth', authRouter)

// export application
module.exports = app;