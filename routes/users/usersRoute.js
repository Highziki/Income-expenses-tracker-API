const express = require("express");
const {
  registerUserCtrl,
  userLoginCtrl,
  userProfileCtrl,
  deleteUserCtrl,
  updateUserCtrl,
} = require("../../controllers/users/usersCtrl");

const isLoggedIn = require("../../middlewares/isLoggedIn");

const usersRoute = express.Router();

// POST/api/v1/users/register
usersRoute.post("/register", registerUserCtrl);

// POST/api/v1/users/login
usersRoute.post("/login", userLoginCtrl);

// GET/api/v1/users/profile
usersRoute.get("/profile/", isLoggedIn, userProfileCtrl);

// DELETE/api/v1/users
usersRoute.delete("/", isLoggedIn, deleteUserCtrl);

// PUT/api/v1/users/
usersRoute.put("/", isLoggedIn, updateUserCtrl);

module.exports = usersRoute;
