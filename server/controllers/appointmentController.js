const appointmentService = require("../service/appointmentService");

// Bệnh nhân đặt lịch hẹn
exports.BookingAppointment = async (req, res) => {
  try {
    // Lấy dữ liệu từ body của request
    const appointmentData = req.body;

    // Gọi service để tạo lịch hẹn
    const newAppointment = await appointmentService.BookingAppointment(
      appointmentData
    );

    // Trả về kết quả thành công và dữ liệu lịch hẹn mới
    return res
      .status(201)
      .json({ message: "Đặt lịch thành công", appointment: newAppointment });
  } catch (error) {
    console.error("Lỗi khi tạo lịch hẹn:", error);
    // Trả về lỗi nếu lịch đã được đặt hoặc có lỗi khác
    return res.status(400).json({ message: error.message });
  }
};
exports.checkDoctorSchedule = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const availableSchedule = await appointmentService.getDoctorAppointments(doctorId);

    // Trả về dữ liệu JSON
    res.status(200).json({
      schedule: availableSchedule,
    });
  } catch (error) {
    console.error("Error checking schedule:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin xác nhận lịch hẹn và gửi SMS
exports.confirmAppointment = async (req, res) => {

  const { id } = req.params; // Đảm bảo req.params có chứa id

  try {
    const appointment = await appointmentService.confirmAppointment(id);
    res
      .status(200)
      .json({
        msg: "Lịch hẹn đã được xác nhận và SMS đã được gửi",
        appointment,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        msg: "Có lỗi xảy ra khi xác nhận lịch hẹn",
        error: error.message,
      });
  }
};

// Bệnh nhân hủy lịch hẹn
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.cancelAppointment(
      req.params.id
    );
    res.status(200).json({ msg: "Lịch hẹn đã bị hủy", appointment });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Có lỗi xảy ra khi hủy lịch hẹn", error: error.message });
  }
};

// Lấy lịch hẹn cho bác sĩ
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getDoctorAppointments(
      req.params.doctorId
    );
    res.status(200).json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({
        msg: "Có lỗi xảy ra khi lấy lịch hẹn của bác sĩ",
        error: error.message,
      });
  }
};

// Lấy lịch hẹn của bệnh nhân
exports.getPatientAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getPatientAppointments(
      req.user._id
    );
    res.status(200).json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({
        msg: "Có lỗi xảy ra khi lấy lịch hẹn của bệnh nhân",
        error: error.message,
      });
  }
};

// Thêm controller mới
exports.getDoctorAppointmentDetails = async (req, res) => {
  try {
    const appointments = await appointmentService.getDoctorAppointmentDetails(
      req.user._id
    );
    res.status(200).json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({
        msg: "Có lỗi xảy ra khi lấy lịch hẹn của bệnh nhân",
        error: error.message,
      });
  }
};

