const express = require("express");
const {
  createService,
  getAllServices,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { authenticate } = require("../middlewares/authenticate");
const { authorize } = require("../middlewares/authorize");

const router = express.Router();

// tao dich vu phong kham
router.post(
  "/create-services",
  authenticate,
  authorize(["admin"]),
  createService
);

// lay tat ca dich vu phong kham
router.get("/all-services", getAllServices);

// cap nhat dich vu phong kham theo id
router.put(
  "/update-services/:id",
  authenticate,
  authorize(["admin"]),
  updateService
);

// xoa dich vu phong kham theo id
router.delete(
  "/delete-services/:id",
  authenticate,
  authorize(["admin"]),
  deleteService
);

module.exports = router;
