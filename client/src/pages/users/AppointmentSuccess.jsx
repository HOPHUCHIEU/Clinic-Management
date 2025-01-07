import React from "react";
import "../../style/AppointmentSuccess/AppointmentSuccess.scss";
import { useLocation, useNavigate } from "react-router-dom";

const AppointmentSuccess = () => {
  const navigate = useNavigate();
  const handleViewAppointments = () => {
    navigate("/thong-tin/lich-kham"); // Redirect to the target page
  };
  const location = useLocation();
  const {
    doctor,
    patient,
    selectedDate,
    selectedSlot,
    note,
    appointmentType,
    videoCallLink,
  } = location.state || {};

  // Log doctor and patient data for debugging
  console.log("Doctor data:", doctor);
  console.log("Location state:", location.state);

  // Function to format date to Vietnamese format
  const formatDateToVN = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  return (
    <div className="appointment-success">
      {/* Success Message */}
      <div className="success-header">
        <div className="success-icon">
          <span>✔</span>
        </div>
        <h2>Đặt lịch thành công</h2>
      </div>

      {/* Row 1: Doctor Info */}
      <div className="row">
        <div className="doctor-info">
          <div className="doctor-img">
            <img
              src={`data:image/jpeg;base64,${doctor?.user.imageUrl}`}
              alt="Doctor"
            />
          </div>
          <div className="doctor-details">
            <div className="doctor-name">
              {doctor
                ? `${doctor.user.first_name} ${doctor.user.last_name}`
                : "N/A"}
            </div>
            <div className="doctor-address">
              {doctor?.user.address || "Địa chỉ chưa được cung cấp"}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Appointment and Patient Information */}
      <div className="row info-section">
        {/* Left Column: Appointment Info */}
        <div className="info-column">
          <h4>Thông tin đặt khám</h4>
          <div className="info-item">
            <span className="label">Ngày khám</span>
            <span>{selectedDate ? formatDateToVN(selectedDate) : "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="label">Khung giờ</span>
            <span>{selectedSlot ? selectedSlot : "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="label">Chuyên khoa</span>
            <span>{doctor?.user.specialties || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="label">Hình thức</span>
            <span>
              {appointmentType === "in-person" ? "Trực tiếp" : "Online"}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Đường Link tham gia</span>
            <span>{videoCallLink ? videoCallLink : "Không có liên kết"}</span>
          </div>
        </div>

        {/* Right Column: Patient Info */}
        <div className="info-column">
          <h4>Thông tin bệnh nhân</h4>
          <div className="info-item">
            <span className="label">Bệnh nhân</span>
            <span>
              {patient
                ? `${patient.user.first_name} ${patient.user.last_name}`
                : "N/A"}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Điện thoại</span>
            <span>{patient?.user.phone || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="label">Ngày sinh</span>
            <span>{patient?.user.birthdate || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="label">Giới tính</span>
            <span>{patient?.user.gender || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="label">Địa chỉ</span>
            <span>{patient?.user.address || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="label">Ghi chú</span>
            <span>{note || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Row 3: Button View Appointment */}
      <div className="row-btn">
        <button className="btn btn-primary" onClick={handleViewAppointments}>
          Xem lịch hẹn
        </button>
      </div>
    </div>
  );
};

export default AppointmentSuccess;
