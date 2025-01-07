const Appointment = require("../models/Appointment");
const Schedule = require("../models/Schedule");
const User = require("../models/User");
const medicalRecordService = require("./medicalRecordService"); // Thêm dòng này

// Bệnh nhân đặt lịch hẹn
exports.BookingAppointment = async (appointmentData) => {
  // Lấy dữ liệu từ appointmentData
  const {
    appointment_date,
    time_slot,
    patient_id,
    doctor_id,
    note,
    appointment_type,
    video_call_link,
  } = appointmentData;

  // Kiểm tra các trường bắt buộc
  if (
    !appointment_date ||
    !time_slot ||
    !patient_id ||
    !doctor_id ||
    !appointment_type
  ) {
    throw new Error("Thiếu thông tin bắt buộc");
  }

  // Kiểm tra xem đã có lịch hẹn nào với bác sĩ và khung giờ này chưa
  const existingAppointment = await Appointment.findOne({
    doctor_id,
    appointment_date: new Date(appointment_date),
    time_slot,
  });

  if (existingAppointment) {
    throw new Error("Lịch hẹn này đã được đặt. Vui lòng chọn thời gian khác.");
  }

  // Tạo mới lịch hẹn
  const newAppointment = new Appointment({
    appointment_date,
    time_slot,
    patient_id,
    doctor_id,
    note,
    appointment_type,
    status: "confirmed",
    video_call_link: appointment_type === "online" ? video_call_link : "", // Chỉ lưu link nếu là khám online
  });
  // Kiểm tra nếu bệnh nhân đã có hồ sơ bệnh án chưa
  let medicalRecord = await medicalRecordService.getMedicalRecordByPatientId(
    patient_id
  );
  if (!medicalRecord.success) {
    // Nếu chưa có, tạo hồ sơ bệnh án mới cho bệnh nhân
    medicalRecord = await medicalRecordService.createMedicalRecord(patient_id);
  }

  // Lưu vào database
  await newAppointment.save();

  return newAppointment; // Trả về lịch hẹn đã tạo
};
// Admin xác nhận lịch hẹn và gửi SMS
exports.confirmAppointment = async (id) => {
  try {
    // Tìm lịch hẹn theo ID
    const appointment = await Appointment.findById(id); // Kiểm tra id được truyền vào
    if (!appointment) {
      throw new Error("Lịch hẹn không tồn tại");
    }

    // Cập nhật trạng thái của lịch hẹn thành confirmed
    appointment.status = "confirmed";
    await appointment.save();

    // Cập nhật lịch làm việc của bác sĩ để xóa khung giờ đã được đặt
    const schedule = await Schedule.findOne({
      doctor_id: appointment.doctor_id,
      date: appointment.appointment_date,
    });
    if (schedule) {
      // Xóa khung giờ đã đặt từ available_slots
      schedule.available_slots = schedule.available_slots.filter(
        (slot) => slot !== appointment.time_slot
      );
      await schedule.save();
    }

    // Gửi tin nhắn SMS cho bệnh nhân sau khi xác nhận
    const patient = await User.findById(appointment.patient_id); // Tìm thông tin bệnh nhân
    if (!patient) {
      throw new Error("Không tìm thấy thông tin bệnh nhân");
    }

    const message = `Lịch hẹn của bạn vào ngày ${appointment.appointment_date} khung giờ ${appointment.time_slot} đã được xác nhận.`;
    console.log(`Gửi SMS tới số: ${patient.phone} với nội dung: ${message}`);
    await sendSMS([patient.phone], message); // Gửi tin nhắn

    return appointment; // Trả về appointment sau khi xử lý
  } catch (error) {
    console.error("Lỗi khi xác nhận lịch hẹn:", error.message);
    throw new Error(error.message);
  }
};

// Bệnh nhân hủy lịch hẹn
exports.cancelAppointment = async (appointmentId) => {
  const appointment = await Appointment.findByIdAndDelete(appointmentId);
  if (!appointment) {
    throw new Error("Lịch hẹn không tồn tại");
  }
  return appointment;
};

// Lấy lịch hẹn của bệnh nhân
exports.getPatientAppointments = async (patientId) => {
  const appointments = await Appointment.find({ patient_id: patientId }).sort({
    appointment_date: -1,
  });
  if (!appointments.length) {
    throw new Error("Không có lịch hẹn nào cho bệnh nhân này.");
  }
  return appointments;
};

// Trong appointmentService.js

// Lấy lịch hẹn của bác sĩ
exports.getDoctorAppointments = async (doctorId) => {
  try {
    // Lấy tất cả các lịch hẹn của bác sĩ, sắp xếp theo ngày gần nhất
    const appointments = await Appointment.find({
      doctor_id: doctorId,
    })
      .sort({ appointment_date: 1 }) // Sắp xếp theo ngày tăng dần
      .populate("patient_id", "first_name last_name phone email imageUrl") // Lấy thông tin bệnh nhân
      .lean();

    if (!appointments.length) {
      throw new Error("Không có lịch hẹn nào cho bác sĩ này.");
    }

    // Trả về danh sách đầy đủ các cuộc hẹn
    return appointments;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách lịch hẹn: " + error.message);
  }
};

// Thêm hàm mới để lấy danh sách chi tiết lịch hẹn của bác sĩ
exports.getDoctorAppointmentDetails = async (doctorId) => {
  try {
    const appointments = await Appointment.find({
      doctor_id: doctorId,
    })
      .populate("patient_id", "first_name last_name phone email imageUrl") // Lấy thông tin bệnh nhân
      .sort({ appointment_date: -1 }) // Sắp xếp theo ngày tăng dần
      .lean();

    if (!appointments.length) {
      throw new Error("Không có lịch hẹn nào cho bác sĩ này.");
    }

    return appointments;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách lịch hẹn: " + error.message);
  }
};

// Thêm API mới để lấy lịch trống của bác sĩ
exports.getDoctorAvailableSchedule = async (doctorId) => {
  try {
    // Lấy tất cả các lịch hẹn đã đặt cho bác sĩ
    const appointments = await Appointment.find({
      doctor_id: doctorId,
      status: { $ne: "cancelled" }, // Không lấy các lịch hẹn đã hủy
    })
      .select("appointment_date time_slot")
      .lean();

    // Tạo một đối tượng để chứa các ngày và khung giờ đã đặt
    const schedule = {};

    appointments.forEach((appointment) => {
      const appointmentDate = appointment.appointment_date
        .toISOString()
        .split("T")[0];
      const timeSlot = appointment.time_slot;

      if (!schedule[appointmentDate]) {
        schedule[appointmentDate] = {
          timeSlots: [],
        };
      }

      schedule[appointmentDate].timeSlots.push(timeSlot);
    });

    // Chuyển đổi đối tượng thành mảng
    const bookedSchedule = Object.keys(schedule).map((date) => ({
      bookedDate: date,
      bookedSlots: schedule[date].timeSlots,
    }));

    return bookedSchedule;
  } catch (error) {
    throw new Error("Lỗi khi lấy lịch trống: " + error.message);
  }
};
