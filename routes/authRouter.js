// import express
const express = require("express");
const { register, login, me, logout } = require("../controllers/authController");

// setup routes
const authRouter = express.Router();

// configure routes
// public routes
authRouter.post('/register', register)
authRouter.post('/login', login)

// protected routes
authRouter.get('/me', me)
authRouter.post('/logout', logout)

// exports routers
module.exports = authRouter