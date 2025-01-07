// controllers/scheduleController.js
const Schedule = require("../models/Schedule");
const Appointment = require("../models/Appointment");
// Hàm để tạo các khung giờ dựa trên thời gian làm việc và độ dài khung giờ
const generateAvailableSlots = (startTime, endTime, slotDuration) => {
  const slots = [];
  let currentTime = new Date(`1970-01-01T${startTime}:00`); // Thiết lập ngày bất kỳ
  const endTimeDate = new Date(`1970-01-01T${endTime}:00`);

  while (currentTime < endTimeDate) {
    const nextTime = new Date(currentTime.getTime() + slotDuration * 60000); // Thêm slotDuration phút
    if (nextTime <= endTimeDate) {
      const slot = `${currentTime.toTimeString().slice(0, 5)}-${nextTime.toTimeString().slice(0, 5)}`;
      slots.push(slot);
    }
    currentTime = nextTime;
  }

  return slots;
};

// Tạo lịch cho bác sĩ
exports.createSchedule = async (req, res) => {
  try {
    const { doctor_id, date, working_hours, slot_duration } = req.body;

    // Kiểm tra thông tin truyền vào
    if (!doctor_id || !date || !working_hours || !slot_duration) {
      return res.status(400).json({ msg: "Thiếu thông tin cần thiết" });
    }

    // Kiểm tra xem bác sĩ đã có lịch trong ngày này chưa
    const existingSchedule = await Schedule.findOne({
      doctor_id,
      date: new Date(date) // Chuyển đổi ngày vào dạng Date
    });

    if (existingSchedule) {
      return res.status(400).json({ msg: "Bác sĩ đã có lịch làm việc cho ngày này" });
    }

    // Tạo khung giờ có sẵn
    const available_slots = generateAvailableSlots(working_hours.start_time, working_hours.end_time, slot_duration);

    const newSchedule = new Schedule({
      doctor_id,
      date,
      working_hours,
      slot_duration,
      available_slots,
    });

    await newSchedule.save();
    res.status(201).json({ success: true, msg: "Lịch làm việc đã được tạo thành công", schedule: newSchedule });
  } catch (error) {
    res.status(500).json({ msg: "Có lỗi xảy ra khi tạo lịch", error: error.message });
  }
};


// Lấy lịch làm việc của bác sĩ

exports.getScheduleByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Xác định ngày hôm nay (không bao gồm thời gian)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Tìm lịch làm việc của bác sĩ với điều kiện ngày >= hôm nay
    const schedules = await Schedule.find({ 
      doctor_id: doctorId, 
      date: { $gte: today } 
    });

    if (schedules.length === 0) {
      return res.status(404).json({ msg: "Không tìm thấy lịch cho bác sĩ" });
    }

    // Lấy các lịch hẹn để kiểm tra khung giờ đã đặt
    const appointments = await Appointment.find({ doctor_id: doctorId });
    const bookedSlots = appointments.map(appointment => ({
      date: appointment.appointment_date.toISOString().split('T')[0],
      timeSlot: appointment.time_slot,
    }));

    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    const fourHoursLater = currentTimeInMinutes + 240;

    // Xây dựng lịch khả dụng
    const availableSchedules = schedules.map(schedule => {
      const scheduleDate = new Date(schedule.date.getFullYear(), schedule.date.getMonth(), schedule.date.getDate());

      const scheduleDateStr = schedule.date.toISOString().split('T')[0];
      const bookedSlotsForDate = bookedSlots
        .filter(booked => booked.date === scheduleDateStr)
        .map(booked => booked.timeSlot);

      // Lọc các khung giờ khả dụng
      const available_slots = schedule.available_slots.filter(slot => {
        const slotTimeInMinutes = parseInt(slot.split(':')[0]) * 60 + parseInt(slot.split(':')[1]);

        if (scheduleDate.getTime() === today.getTime()) {
          return slotTimeInMinutes >= fourHoursLater && !bookedSlotsForDate.includes(slot);
        }

        return !bookedSlotsForDate.includes(slot);
      });

      return {
        doctor_id: schedule.doctor_id,
        date: schedule.date,
        working_hours: schedule.working_hours,
        slot_duration: schedule.slot_duration,
        available_slots,
      };
    });

    res.status(200).json(availableSchedules.filter(schedule => schedule.available_slots.length > 0));
  } catch (error) {
    res.status(500).json({ msg: "Có lỗi xảy ra khi lấy lịch", error: error.message });
  }
};

