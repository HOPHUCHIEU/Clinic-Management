const express = require("express");
const {
  getUserById,
  getAllUserByRole,
  updateUser,
  deleteUser,
  getDoctorsBySpecialty,  // Tạo tài khoản bệnh nhân (admin, doctor)
} = require("../controllers/adminController");
const { authenticate } = require("../middlewares/authenticate");
const { authorize } = require("../middlewares/authorize");
const router = express.Router();

router.get("/users/:id", authenticate, getUserById);


// Cập nhật thông tin người dùng 
router.put("/edit-users/:id", authenticate, updateUser);





module.exports = router;
