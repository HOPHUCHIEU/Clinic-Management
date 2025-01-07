// routes/scheduleRoutes.js
const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const { authenticate } = require("../middlewares/authenticate");
const { authorize } = require("../middlewares/authorize");
const {getDoctorSchedules,deleteDoctorSchedules,updateSchedule}=require("../controllers/ManageSchedualController.js");
// Tạo lịch cho bác sĩ (chỉ cho admin)
router.post("/create-schedual", authenticate,authorize(["admin"]), scheduleController.createSchedule);

// Lấy lịch làm việc của bác sĩ
router.get("/get-schedual/:doctorId",authenticate , scheduleController.getScheduleByDoctor);

router.get("/doctor-schedule", getDoctorSchedules);
router.delete("/delete-schedule/:schedualId", deleteDoctorSchedules);
router.put("/update-schedules/:id", updateSchedule);
module.exports = router;
