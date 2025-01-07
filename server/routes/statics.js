const express = require("express");
const router = express.Router();
const appointmentController= require("../controllers/statics")
router.get("/count-by-specialties", appointmentController.getAppointmentCountBySpecialties);
router.get('/today/count', appointmentController.getTodayAppointmentCount);
router.get("/daily-appointments",appointmentController.getDailyAppointmentCountByDoctor);
router.get("/monthly-appointments", appointmentController.getMonthlyAppointmentCountByDoctor);
router.get("/average-consultation-time", appointmentController.getAverageConsultationTimeByDoctor);
module.exports = router;