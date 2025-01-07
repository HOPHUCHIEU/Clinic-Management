const {
  createMedicine,
  getAllMedicines,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/medicineController");
const express = require("express");
const { authenticate } = require("../middlewares/authenticate");
const { authorize } = require("../middlewares/authorize");
const router = express.Router();

router.post(
  "/create-medicine",
  authenticate,
  authorize(["admin", "doctor"]),
  createMedicine
);

router.get("/all-medicines", getAllMedicines);
// đóng authenticate lại khi ko đăng nhập vẫn có thể xem thuốc

router.put(
  "/update-medicine/:id",
  authenticate,
  authorize(["admin"]),
  updateMedicine
);

router.delete(
  "/delete-medicine/:id",
  authenticate,
  authorize(["admin"]),
  deleteMedicine
);

module.exports = router;
