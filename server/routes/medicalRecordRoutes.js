const express = require("express");
const router = express.Router();
const medicalRecordController = require("../controllers/medicalRecordController");
const { authenticate } = require("../middlewares/authenticate");
const { authorize } = require("../middlewares/authorize");

// Tạo hồ sơ bệnh án cho bệnh nhân
router.post(
  "/create",
  authenticate,
  medicalRecordController.createMedicalRecord
);

// Thêm lịch sử khám bệnh vào hồ sơ bệnh án của bệnh nhân
router.post(
  "/:patientId/add-visit",
  authenticate,
  authorize("doctor"),
  medicalRecordController.addVisitHistory
);

// Lấy danh sách hồ sơ bệnh án (có phân trang)
router.get("/", medicalRecordController.getAllMedicalRecords);

// Lấy hồ sơ bệnh án theo ID của hồ sơ bệnh án
router.get("/:patientId", medicalRecordController.getMedicalRecordByPatientId);

module.exports = router;
