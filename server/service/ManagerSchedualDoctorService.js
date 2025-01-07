const User = require("../models/User");
const Schedule = require("../models/Schedule");

const getDoctorSchedulesByDate = async (date) => {
  try {
    // Parse the input date and set the start and end of the day
    const selectedDate = new Date(date);
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + 1);

    // Query the Schedule model for schedules on the specified date (ignoring time)
    const schedules = await Schedule.find({
      date: {
        $gte: selectedDate,
        $lt: nextDate,
      },
    })
      .populate("doctor_id", "first_name last_name specialties") // Fetch name and specialties fields
      .select("doctor_id date working_hours slot_duration");

    // Filter out schedules with null or invalid doctor_id
    const validSchedules = schedules.filter((schedule) => schedule.doctor_id);

    // Transform the data to include only required fields
    return validSchedules.map((schedule) => ({
      schedule_id: schedule._id, // Include the schedule ID
      doctor_id: schedule.doctor_id._id,
      doctor_name: `${schedule.doctor_id.first_name} ${schedule.doctor_id.last_name}`,
      specialties: schedule.doctor_id.specialties, // Add specialties here
      date: schedule.date,
      start_time: schedule.working_hours.start_time,
      end_time: schedule.working_hours.end_time,
      slot_duration: schedule.slot_duration,
    }));
  } catch (error) {
    console.error("Error fetching doctor schedules:", error);
    throw new Error("Could not fetch schedules. Please try again later.");
  }
};

const deleteScheduleById = async (scheduleId) => {
    try {
      // Tìm và xóa lịch theo ID
      const deletedSchedule = await Schedule.findByIdAndDelete(scheduleId);
  
      // Kiểm tra xem lịch có tồn tại không
      if (!deletedSchedule) {
        return { success: false, message: "Lịch không tồn tại." };
      }
  
      return {
        success: true,
        message: "Xóa lịch thành công.",
        data: deletedSchedule,
      };
    } catch (error) {
      console.error("Error deleting schedule:", error);
      return {
        success: false,
        message: "Có lỗi xảy ra trong quá trình xóa lịch.",
      };
    }
  };
  
const updateScheduleFields = async (id, updateData) => {
    // Filter out undefined values to only update fields that are provided
    const updateObject = {};
    if (updateData.date) updateObject.date = updateData.date;
    if (updateData.working_hours) updateObject.working_hours = updateData.working_hours;
    if (updateData.slot_duration !== undefined) updateObject.slot_duration = updateData.slot_duration;
  
    // Find the schedule by ID and update it
    return await Schedule.findByIdAndUpdate(
      id,   
      updateObject,
      { new: true, runValidators: true } // Return the updated document and run validation
    );
  };
module.exports = { getDoctorSchedulesByDate, deleteScheduleById ,updateScheduleFields};
