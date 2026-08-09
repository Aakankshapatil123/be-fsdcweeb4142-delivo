const express = require("express");
const { getMyNotifications, markAsRead } = require("../controllers/notificationController");
const { isAuthenticated, allowRoles } = require("../middlewares/auth");


const notificationRouter = express.Router();

notificationRouter.use(isAuthenticated)
notificationRouter.use(allowRoles(["user"]))

notificationRouter.get("/", getMyNotifications)
notificationRouter.put("/:id/read", markAsRead)

module.exports = notificationRouter