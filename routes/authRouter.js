// import express
const express = require("express");
const { register, login, me, logout } = require("../controllers/authController");
const { isAuthenticated } = require("../middlewares/auth");

// setup routes
const authRouter = express.Router();

// configure routes
// public routes
authRouter.post('/register', register)
authRouter.post('/login', login)

// protected routes
authRouter.get('/me',isAuthenticated, me)
authRouter.post('/logout', isAuthenticated, logout)

// exports routers
module.exports = authRouter