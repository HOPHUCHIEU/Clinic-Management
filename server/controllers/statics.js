// controllers/appointmentController.js
const appointmentService = require('../service/Statics');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const getAppointmentCountBySpecialties = async (req, res) => {
    try {
      const result = await appointmentService.getAppointmentCountBySpecialties();
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching appointment count by specialties" });
    }
  };
  const getTodayAppointmentCount = async (req, res) => {
    try {
      const count = await appointmentService.getTodayAppointmentCount();
      res.status(200).json({ count });
    } catch (err) {
      console.error("Error fetching today's appointment count:", err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  const getDailyAppointmentCountByDoctor = async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Bắt đầu của ngày hiện tại
  
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999); // Kết thúc của ngày hiện tại
  
      const appointments = await Appointment.aggregate([
        {
          $match: {
            appointment_date: { $gte: today, $lte: endOfDay } // Lọc trong phạm vi của ngày hôm nay
          }
        },
        {
          $group: {
            _id: "$doctor_id",
            count: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "doctor"
          }
        },
        { $unwind: "$doctor" },
        {
          $project: {
            _id: 0,
            doctor_id: "$doctor._id",
            doctor_name: { $concat: ["$doctor.first_name", " ", "$doctor.last_name"] },
            count: 1
          }
        }
      ]);
  
      res.json({ success: true, data: appointments });
    } catch (error) {
      console.error("Error calculating daily appointments:", error);
  
      res.status(500).json({ success: false, message: "Error calculating daily appointments.", error });
    }
  };
  
  
  // API 2: Số lượng bệnh nhân mỗi bác sĩ khám trong tháng
  const getMonthlyAppointmentCountByDoctor = async (req, res) => {
    try {
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  
      const appointments = await Appointment.aggregate([
        { $match: { appointment_date: { $gte: firstDayOfMonth } } },
        { $group: { _id: "$doctor_id", count: { $sum: 1 } } },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "doctor",
          },
        },
        { $unwind: "$doctor" },
        {
          $project: {
            _id: 0,
            doctor_id: "$doctor._id",
            doctor_name: { $concat: ["$doctor.first_name", " ", "$doctor.last_name"] },
            specialties: "$doctor.specialties",  // Thêm chuyên khoa vào kết quả trả về
            count: 1,
          },
        },
      ]);
  
      res.json({ success: true, data: appointments });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error calculating monthly appointments.", error });
    }
  };

  
  // API 3: Thời gian khám trung bình của mỗi bác sĩ trong tháng
  const getAverageConsultationTimeByDoctor = async (req, res) => {
    try {
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        const appointments = await Appointment.aggregate([
            { $match: { appointment_date: { $gte: firstDayOfMonth }, status: "confirmed" } },
            {
                $lookup: {
                    from: "schedules",
                    localField: "doctor_id",
                    foreignField: "doctor_id",
                    as: "schedule",
                },
            },
            { $unwind: "$schedule" },
            {
                $addFields: {
                    start_time: {
                        $dateFromParts: {
                            year: { $year: "$appointment_date" },
                            month: { $month: "$appointment_date" },
                            day: { $dayOfMonth: "$appointment_date" },
                            hour: { $toInt: { $substr: ["$schedule.working_hours.start_time", 0, 2] } },
                            minute: { $toInt: { $substr: ["$schedule.working_hours.start_time", 3, 2] } }
                        }
                    },
                    end_time: {
                        $dateFromParts: {
                            year: { $year: "$appointment_date" },
                            month: { $month: "$appointment_date" },
                            day: { $dayOfMonth: "$appointment_date" },
                            hour: { $toInt: { $substr: ["$schedule.working_hours.end_time", 0, 2] } },
                            minute: { $toInt: { $substr: ["$schedule.working_hours.end_time", 3, 2] } }
                        }
                    }
                }
            },
            {
                $addFields: {
                    duration: {
                        $divide: [
                            { $subtract: ["$end_time", "$start_time"] },
                            1000 * 60 // Convert milliseconds to minutes
                        ]
                    }
                }
            },
            { $group: { _id: "$doctor_id", avg_consultation_time: { $avg: "$duration" } } },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "doctor",
                },
            },
            { $unwind: "$doctor" },
            {
                $project: {
                    _id: 0,
                    doctor_id: "$doctor._id",
                    doctor_name: { $concat: ["$doctor.first_name", " ", "$doctor.last_name"] },
                    avg_consultation_time: 1,
                },
            }
        ]);

        res.json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error calculating average consultation time.", error });
    }
};


module.exports = {
  getAppointmentCountBySpecialties,
  getTodayAppointmentCount,
  getDailyAppointmentCountByDoctor,
  getMonthlyAppointmentCountByDoctor,
  getAverageConsultationTimeByDoctor,
};
