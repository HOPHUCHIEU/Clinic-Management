const express = require("express");
const {
  createDoctor,
  getUserById,
  getAllUserByRole,
  updateUser,
  deleteUser,
  createPatient,
  getDoctorsBySpecialty,
  countUsersByRole ,
  getDoctorsBySearch  
} = require("../controllers/adminController");
const { authenticate } = require("../middlewares/authenticate");
const { authorize } = require("../middlewares/authorize");
const router = express.Router();
// Tạo tài khoản bác sĩ (admin only)
router.post("/create-doctor", authenticate, authorize(["admin"]), createDoctor);

// Tạo tài khoản bệnh nhân (admin, doctor)
router.post("/create-patient", authenticate, authorize(["admin","doctor"]), createPatient);
// Lấy thông tin người dùng theo ID 
router.get("/users/:id", getUserById);

// Lấy tất cả người dùng theo vai trò (admin only)
router.get(
  "/users",

  getAllUserByRole
);
router.post(
  "/doctor-specialties",
  getDoctorsBySpecialty
)

// Cập nhật thông tin người dùng 
router.put("/edit-users/:id", authenticate, updateUser);

// Xóa người dùng (admin only)
router.delete("/delete-users/:id", authenticate, authorize(["admin"]), deleteUser);

router.get("/count-userbyRole",authenticate, authorize(["admin"]),countUsersByRole);
router.get("/search-doctor", getDoctorsBySearch);


module.exports = router;
