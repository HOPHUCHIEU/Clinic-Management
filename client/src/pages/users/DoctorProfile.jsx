import React, { useEffect, useState } from "react";
import "../../style/DoctorProfile/DoctorProfile.scss";
import { getUserById } from "../../utils/AuthAPI/AdminService";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getScheduleDoctorById } from "../../utils/SchedualAPI/SchedualService";
import { checkDoctorSchedule } from "../../utils/AppointmentAPI/AppointmentService";
import Cookies from "js-cookie";
import Spinner from "react-bootstrap/Spinner";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [patientId, setPatientId] = useState(Cookies.get("id"));
  const [morningSlots, setMorningSlots] = useState([]);
  const [afternoonSlots, setAfternoonSlots] = useState([]);
  const [formattedToday, setFormattedToday] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // check status login
  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctorData = await getUserById(doctorId, "doctor");
        // console.log(doctorData);
        setDoctor(doctorData);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    const fetchScheduleData = async () => {
      try {
        const scheduleData = await getScheduleDoctorById(doctorId);
        setSchedule(scheduleData);
        const today = new Date();
        const formattedToday = today.toISOString().split("T")[0]; // 2024-10-25
        setFormattedToday(formattedToday);

        const futureSchedule = scheduleData.filter((day) => {
          const scheduleDate = new Date(day.date).toISOString().split("T")[0];
          return scheduleDate >= formattedToday;
        });

        if (futureSchedule.length > 0) {
          setSelectedDate(futureSchedule[0].date);
        }

        const currentDateInSchedule = futureSchedule.find(
          (day) => day.date.split("T")[0] === formattedToday
        );
        if (currentDateInSchedule) {
          setSelectedDate(currentDateInSchedule.date);
        } else {
          console.log("Current date is NOT in schedule"); // Added log
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    const fetchBookedDatesData = async () => {
      try {
        const appointments = await checkDoctorSchedule(doctorId);
        if (Array.isArray(appointments)) {
          const dates = appointments.map((app) => app.appointment_date);
          setBookedDates(dates);
          const slots = appointments.flatMap((app) => app.time_slots || []);
          setBookedSlots(slots);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([
        fetchDoctorData(),
        fetchScheduleData(),
        fetchBookedDatesData(),
      ]);
      setLoading(false); // Tắt loading sau khi tải xong
    };

    fetchData();
  }, [doctorId, patientId]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  useEffect(() => {
    // Check if selectedDate and schedule are available
    if (selectedDate && schedule.length) {
      const selectedDaySchedule = schedule.find(
        (day) => day.date === selectedDate
      );
      console.log(selectedDaySchedule);

      // Ensure selectedDaySchedule is defined
      if (selectedDaySchedule) {
        // Corrected variable name from selectedDateFomat to selectedDateFormat

        setMorningSlots(
          selectedDaySchedule.available_slots.filter((slot) => {
            const hour = parseInt(slot.split(":")[0]);
            return hour < 12 && !bookedSlots.includes(slot);
          })
        );

        setAfternoonSlots(
          selectedDaySchedule.available_slots.filter((slot) => {
            const hour = parseInt(slot.split(":")[0]);
            return hour >= 12 && !bookedSlots.includes(slot);
          })
        );
      }
    }
  }, [selectedDate, schedule, bookedSlots]);

  useEffect(() => {
    console.log("Updated Morning Slots:", schedule);
  }, [schedule]);

  const formatDate = (dateString) => {
    const options = { weekday: "short", day: "2-digit", month: "2-digit" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const isSlotBooked = (date, slot) => {
    return bookedDates.includes(date) && bookedSlots.includes(slot);
  };

  if (!isLoggedIn) {
    return (
      <div className="login-prompt">
        <p className="login-message_prompt">
          Vui lòng đăng nhập để xem lịch khám.
        </p>
        <button
          onClick={() => navigate("/login-register")}
          className="login-button_prompt"
        >
          Đăng nhập
        </button>
      </div>
    );
  }
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!doctor) {
    return <p>Loading...</p>;
  }

  return (
    <div className="doctor-profile">
      <div className="doctor-header">
        <div className="doctor-img">
          <img
            src={`data:image/jpeg;base64,${doctor.user.imageUrl}`}
            alt={`${doctor.user.first_name} ${doctor.user.last_name}`}
            className="doctor-img"
          />
        </div>
        <div className="doctor-info">
          <h2 className="doctor-name">
            <span className="doctor-name__title">Bác sĩ </span>
            {doctor.user.first_name} {doctor.user.last_name}
          </h2>
          <div className="doctor-details">
            <span className="doctor-title">Bác sĩ</span>
            <span className="doctor-experience">15 năm kinh nghiệm</span>
          </div>
          <div className="doctor-specialty">
            <span>Chuyên khoa: </span>
            <a href="#">{doctor.user.specialties}</a>
          </div>
          <div>
            <h5 className="information-doctor">Thông tin bác sĩ</h5>
            <p>
              Khám và điều trị các bệnh lý về nội khoa, nhi khoa, tâm thần kinh.
              Tư vấn về dinh dưỡng và phát triển thể chất cho trẻ em. Khám và tư
              vấn về sức khỏe, phòng ngừa bệnh cho trẻ em và phụ nữ mang thai.
              Tham gia các chương trình tình nguyện, hướng dẫn cách chăm sóc trẻ
              sơ sinh, trẻ nhỏ.
            </p>
          </div>
        </div>
      </div>
      <div className="note-container">
        <div className="note-header">
          <span className="note-icon">⚠️</span>
          <h3 className="note-title">Lưu ý</h3>
        </div>
        <p className="note-content">
          * Nếu bệnh nhân bận việc không đến khám được, vui lòng hủy lịch khám
          đã đặt và đặt lại ngày khác.
        </p>
        <p className="note-content">* Vui lòng đặt lịch khám trước 4h.</p>
        <p className="note-content">* Xin cảm ơn!</p>
      </div>
      <div className="quick-booking">
        <h3 className="section-title">Đặt khám nhanh</h3>
        <div className="date-list">
          {schedule
            .filter((day) => {
              const scheduleDate = new Date(day.date)
                .toISOString()
                .split("T")[0];
              return scheduleDate >= formattedToday;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((day, index) => {
              const isBooked = bookedDates.includes(day.date);
              const totalSlots = day.available_slots.length;

              return (
                <div
                  className={`date-item ${isBooked ? "booked" : ""} ${
                    selectedDate === day.date ? "selected-date" : ""
                  }`}
                  key={index}
                  onClick={() => !isBooked && handleDateClick(day.date)}
                >
                  <span>{formatDate(day.date)}</span>
                  <span className="time-frame">{totalSlots} khung giờ</span>
                </div>
              );
            })}
        </div>
        <div className="time-slot-section">
          <div className="time-slot-title">
            🌅 Buổi sáng ({morningSlots.length} khung giờ)
          </div>
          <div className="time-slot-list">
            {morningSlots.length > 0 ? (
              morningSlots.map((slot, index) => (
                <button
                  className={`time-slot ${
                    selectedSlot === slot ? "selected" : ""
                  } ${isSlotBooked(selectedDate, slot) ? "disabled" : ""}`}
                  key={index}
                  onClick={() =>
                    !isSlotBooked(selectedDate, slot) && handleSlotClick(slot)
                  }
                  disabled={isSlotBooked(selectedDate, slot)}
                >
                  {slot}
                </button>
              ))
            ) : (
              <p>Không có khung giờ nào vào buổi sáng.</p>
            )}
          </div>

          <div className="time-slot-title">
            🌇 Buổi chiều ({afternoonSlots.length} khung giờ)
          </div>
          <div className="time-slot-list">
            {afternoonSlots.length > 0 ? (
              afternoonSlots.map((slot, index) => (
                <button
                  className={`time-slot ${
                    selectedSlot === slot ? "selected" : ""
                  } ${isSlotBooked(selectedDate, slot) ? "disabled" : ""}`}
                  key={index}
                  onClick={() =>
                    !isSlotBooked(selectedDate, slot) && handleSlotClick(slot)
                  }
                  disabled={isSlotBooked(selectedDate, slot)}
                >
                  {slot}
                </button>
              ))
            ) : (
              <p>Không có khung giờ nào vào buổi chiều.</p>
            )}
          </div>
        </div>
      </div>

      <div className="doctor-info-section">
        <h3 className="doctor-info-title">Thông tin phòng khám</h3>
        <ul className="doctor-info-list">
          Phòng khám Pandora là địa chỉ chăm sóc sức khỏe uy tín, chuyên nghiệp.
          Với đội ngũ bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại, chúng
          tôi cam kết mang đến cho khách hàng những dịch vụ y tế chất lượng cao.
          Phòng khám chuyên về các lĩnh vực điều trị ngoài da và viêm da cơ địa,
          đảm bảo đáp ứng mọi nhu cầu khám chữa bệnh của bạn.
        </ul>
      </div>
      <div className="booking-footer">
        <span className="support-text">
          Hỗ trợ đặt khám <strong>0935038810</strong>
        </span>
        <NavLink
          to={{
            pathname: `/dat-kham/ho-so-lich/${doctor.user._id}/${patientId}`,
          }}
          state={{ doctor, selectedDate, selectedSlot }}
        >
          <button className="book-now-button">Đặt khám ngay</button>
        </NavLink>
      </div>
    </div>
  );
};

export default DoctorProfile;
