const {
  getDoctorSchedulesByDate,
  deleteScheduleById,
  updateScheduleFields,
} = require("../service/ManagerSchedualDoctorService");
const Schedule = require("../models/Schedule");
 
const getDoctorSchedules = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "Date is required." });
    }

    const doctorSchedules = await getDoctorSchedulesByDate(date);
    res.json({ success: true, data: doctorSchedules });
  } catch (error) {
    console.error("Error fetching doctor schedules:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching doctor schedules." });
  }
};
const deleteDoctorSchedules = async (req, res) => {
  try {
    let scheduleId = req.params.schedualId.trim(); // Xóa khoảng trắng và ký tự xuống dòng
    const result = await deleteScheduleById(scheduleId);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error deleting doctor schedule:", error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting doctor schedule." });
  }
};
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
 
  const updateSchedule = async (req, res) => {
    const { id } = req.params; // Get schedule ID from URL parameters
    const { date, working_hours, slot_duration } = req.body; // Destructure the fields we want to update

    // Validate required fields
    if (!date && !working_hours && slot_duration === undefined) {
        return res.status(400).json({ message: "At least one field must be provided for update." });
    }

    try {
        // Lấy lịch hiện tại để kiểm tra các thông tin cần thiết
        const currentSchedule = await Schedule.findById(id);
        if (!currentSchedule) {
            return res.status(404).json({ message: "Schedule not found." });
        }

        // Cập nhật các trường
        const updatedData = {};
        if (date) updatedData.date = date;
        if (working_hours) updatedData.working_hours = working_hours;
        if (slot_duration !== undefined) updatedData.slot_duration = slot_duration;

        // Cập nhật lịch
        const updatedSchedule = await updateScheduleFields(id, updatedData);

        // Nếu working_hours hoặc slot_duration đã thay đổi, tính toán lại available_slots
        const newWorkingHours = updatedData.working_hours || currentSchedule.working_hours;
        const newSlotDuration = updatedData.slot_duration !== undefined ? updatedData.slot_duration : currentSchedule.slot_duration;

        const newAvailableSlots = generateAvailableSlots(newWorkingHours.start_time, newWorkingHours.end_time, newSlotDuration);

        // Cập nhật lại available_slots trong lịch
        updatedSchedule.available_slots = newAvailableSlots;
        await updatedSchedule.save(); // Lưu lại cập nhật

        res.status(200).json({
            message: "Schedule updated successfully.",
            success: true,
            data: updatedSchedule,
        });
    } catch (error) {
        console.error("Error updating schedule fields:", error);
        res.status(500).json({ message: "Error updating schedule fields.", error });
    }
};


module.exports = { getDoctorSchedules, deleteDoctorSchedules, updateSchedule };
