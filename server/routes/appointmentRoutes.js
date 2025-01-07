const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

const { authenticate } = require("../middlewares/authenticate");
const { authorize } = require("../middlewares/authorize");

// Bệnh nhân đặt lịch hẹn
router.post("/book-appointment", authenticate, appointmentController.BookingAppointment);

// Admin xác nhận lịch hẹn và gửi SMS
router.put("/confirm/:id", authenticate, authorize(["admin"]), appointmentController.confirmAppointment);

// Bệnh nhân hủy lịch hẹn
router.delete("/cancel/:id", authenticate, appointmentController.cancelAppointment);

// Lấy lịch hẹn cho bác sĩ
router.get("/doctor/:doctorId", authenticate, appointmentController.getDoctorAppointments);

// Lấy lịch hẹn của bệnh nhân
router.get("/patient/:patientId", authenticate, appointmentController.getPatientAppointments);

router.get('/appointments/:doctorId', appointmentController.checkDoctorSchedule);

// Lấy lịch hẹn của bác sĩ 
router.get("/doctor-appointments/:doctorId", authenticate, appointmentController.getDoctorAppointmentDetails);

module.exports = router;
