const express = require("express");
const {
  login,
  register,
  changePassword,
} = require("../controllers/authController");
const { authenticate } = require("../middlewares/authenticate");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.put("/change-password", authenticate, changePassword);
module.exports = router;
