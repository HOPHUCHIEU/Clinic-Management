import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaTimesCircle } from "react-icons/fa";
import "../../../style/Appointment/Appointment.scss";
import doctorPlaceholder from "../../../assets/img/customer01.png"; // Default image
import { getUserById } from "../../../utils/AuthAPI/AdminService";
import {
  getAppointmentPatient,
  deleteAppointment,
} from "../../../utils/AppointmentAPI/AppointmentService";
import { sendCancellationReason } from "../../../utils/EmailNontification/EmailNontificationService";
import Countdown from "./Countdown";
import ConfirmationDialog from "../../layout/ConfirmationDialog"; // Confirmation dialog
import { toast } from "react-toastify";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [doctorsInfo, setDoctorsInfo] = useState({});
  const [patientInfo, setPatientInfo] = useState(null);
  const [countdownFinished, setCountdownFinished] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [showConfirmation, setShowConfirmation] = useState(false); // Show confirmation dialog
  const [appointmentToDelete, setAppointmentToDelete] = useState(null); // Store the appointment to delete
  const [cancellationReason, setCancellationReason] = useState(""); // State lưu lý do hủy
  const [isCancelling, setIsCancelling] = useState(false); // Trạng thái loading

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointmentPatient();
        const appointmentData = response;

        if (Array.isArray(appointmentData) && appointmentData.length > 0) {
          setAppointments(appointmentData);
          handleSelectAppointment(appointmentData[0]); // Default selection

          const doctorsPromises = appointmentData.map(async (appointment) => {
            try {
              const doctorResponse = await getUserById(
                appointment.doctor_id,
                "doctor"
              );
              return { id: appointment.doctor_id, info: doctorResponse.user };
            } catch (error) {
              console.error(
                `Error fetching doctor info for ID ${appointment.doctor_id}:`,
                error
              );
              return { id: appointment.doctor_id, info: null }; // Return null on error
            }
          });

          const doctorsData = await Promise.all(doctorsPromises);
          const doctorsMap = doctorsData.reduce((acc, doctor) => {
            acc[doctor.id] = doctor.info;
            return acc;
          }, {});

          setDoctorsInfo(doctorsMap);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  const handleSelectAppointment = async (appointment) => {
    setSelectedAppointment(appointment);
    try {
      const patientResponse = await getUserById(
        appointment.patient_id,
        "patient"
      );
      setPatientInfo(patientResponse.user);
    } catch (error) {
      console.error("Error fetching patient info:", error);
    }
  };

  const handleCountdownEnd = (appointmentId) => {
    setCountdownFinished((prev) => ({
      ...prev,
      [appointmentId]: true,
    }));
  };

  const parseAppointmentTime = (appointment) => {
    const timeSlot = appointment.time_slot.split("-");
    const startTime = timeSlot[0].trim();
    const appointmentDate = new Date(appointment.appointment_date);
    const [hours, minutes] = startTime.split(":").map(Number);
    return new Date(
      appointmentDate.getFullYear(),
      appointmentDate.getMonth(),
      appointmentDate.getDate(),
      hours,
      minutes
    );
  };

  const shouldShowButton = (appointment) => {
    const now = new Date();
    const appointmentTime = parseAppointmentTime(appointment);
    const oneHourBefore = new Date(appointmentTime.getTime() - 24 * 60 * 60 * 1000);
    return (
      appointment.appointment_type === "online" &&
      now >= oneHourBefore &&
      !countdownFinished[appointment._id]
    );
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) {
      toast.error("Không tìm thấy thông tin lịch hẹn.");
      return;
    }
  
    setIsCancelling(true); // Hiển thị vòng tròn loading
    try {
      const doctorEmail = doctorsInfo[selectedAppointment.doctor_id]?.email;
      const appointmentId = selectedAppointment._id;
  
      const appointmentInfo = {
        timeSlot: selectedAppointment.time_slot,
        date: new Date(selectedAppointment.appointment_date).toLocaleDateString(),
        type: selectedAppointment.appointment_type,
      };
  
      const patientInfoData = {
        fullName: `${patientInfo.first_name} ${patientInfo.last_name}`,
        gender: patientInfo.gender,
        birthYear: new Date(patientInfo.birthdate).getFullYear(),
        phone: patientInfo.phone,
      };
  
      const payload = {
        doctorEmail,
        appointmentId,
        cancellationReason,
        appointmentInfo,
        patientInfo: patientInfoData,
      };
  
      if (doctorEmail) {
        await sendCancellationReason(payload);
        toast.success("Email thông báo lý do hủy lịch đã được gửi.");
      } else {
        toast.warning("Không tìm thấy email của bác sĩ để gửi thông báo.");
      }
  
      await deleteAppointment(appointmentToDelete);
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appt) => appt._id !== appointmentToDelete)
      );
      setSelectedAppointment(null);
      toast.success("Lịch hẹn đã được hủy thành công.");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Có lỗi xảy ra khi hủy lịch hẹn.");
    } finally {
      setIsCancelling(false); // Tắt vòng tròn loading
      setShowConfirmation(false);
      setAppointmentToDelete(null);
      setCancellationReason(""); // Reset lý do hủy
    }
  };
  
  

  const openConfirmationDialog = (appointmentId) => {
    setAppointmentToDelete(appointmentId);
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setAppointmentToDelete(null);
  };

  const normalizeString = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredAppointments = appointments.filter((appointment) => {
    const doctorName = `${doctorsInfo[appointment.doctor_id]?.first_name ||
      ""} ${doctorsInfo[appointment.doctor_id]?.last_name || ""}`;
    const normalizedSearchTerm = normalizeString(searchTerm);

    return (
      normalizeString(doctorName).includes(normalizedSearchTerm) ||
      normalizeString(appointment.appointment_type === 'online' ? 'Khám trực tuyến' : 'Khám trực tiếp').includes(
        normalizedSearchTerm
      ) ||
      normalizeString(appointment.time_slot).includes(normalizedSearchTerm) ||
      normalizeString(
        new Date(appointment.appointment_date).toLocaleDateString()
      ).includes(normalizedSearchTerm) ||
      normalizeString(appointment._id).includes(normalizedSearchTerm)
    );
  });

  const getAppointmentStatus = (appointment) => {
    if (appointment.status === "cancelled") return "cancelled";

    const appointmentTime = parseAppointmentTime(appointment);
    const twoHoursAfter = new Date(
      appointmentTime.getTime() + 2 * 60 * 60 * 1000
    );
    const now = new Date();

    if (now > twoHoursAfter) return "completed";
    return "confirmed";
  };

  return (
    <div className="appointment-container">
      <div className="appointment-list">
        <h2>Lịch khám</h2>
        <input
          type="text"
          placeholder="Mã giao dịch, tên dịch vụ, tên bệnh nhân..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị tìm kiếm
        />
        <div className="appointment-content">
          <ul>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <li
                  key={appointment._id}
                  className={`appointment-item ${
                    selectedAppointment &&
                    selectedAppointment._id === appointment._id
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleSelectAppointment(appointment)}
                >
                  <div>
                    <h3>
                      {doctorsInfo[appointment.doctor_id]
                        ? `${doctorsInfo[appointment.doctor_id].first_name} ${
                            doctorsInfo[appointment.doctor_id].last_name
                          }`
                        : "Bác sĩ không xác định"}
                    </h3>
                    <p>
                      {appointment.time_slot} -{" "}
                      {new Date(
                        appointment.appointment_date
                      ).toLocaleDateString()}
                    </p>
                    <h4 className="appointment-type">
                      {appointment.appointment_type === 'online' ? 'Khám trực tuyến' : 'Khám trực tiếp'}
                    </h4>
                    <span
                      className={`status ${
                        getAppointmentStatus(appointment) === "cancelled"
                          ? "cancelled"
                          : getAppointmentStatus(appointment) === "completed"
                          ? "completed"
                          : ""
                      }`}
                    >
                      {getAppointmentStatus(appointment) === "cancelled" ? (
                        <FaTimesCircle />
                      ) : (
                        <FaCalendarAlt />
                      )}
                      {getAppointmentStatus(appointment) === "cancelled"
                        ? "Đã hủy"
                        : getAppointmentStatus(appointment) === "completed"
                        ? "Đã kết thúc"
                        : "Đã đặt lịch"}
                    </span>
                    <div className="countdown-container">
                      <Countdown
                        targetDate={parseAppointmentTime(appointment)}
                        onCountdownEnd={() =>
                          handleCountdownEnd(appointment._id)
                        }
                        isActive={!countdownFinished[appointment._id]}
                      />
                      {shouldShowButton(appointment) && (
                        <button
                          className="countdown"
                          onClick={() =>
                            window.open(appointment.video_call_link, "_blank")
                          }
                        >
                          Tham gia cuộc họp
                        </button>
                      )}
                    </div>
                    <div>
                      <button
                        className="delete-button"
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn không cho sự kiện onClick của li kích hoạt
                          openConfirmationDialog(appointment._id); // Mở hộp thoại xác nhận
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p>Không có lịch hẹn nào</p>
            )}

            {showConfirmation && (
          <ConfirmationDialog
          message="Bạn có chắc chắn muốn hủy lịch hẹn này không?"
          onConfirm={handleCancelAppointment}
          onCancel={handleCloseConfirmation}
        >
          {isCancelling ? (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <textarea
                placeholder="Nhập lý do hủy lịch hẹn"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="cancellation-reason-input"
                style={{
                  width: "100%",
                  height: "100px",
                  marginTop: "10px",
                  padding: "10px",
                  fontSize: "14px",
                }}
              />
              <button
                className="confirm-button"
                onClick={handleCancelAppointment}
                style={{ position: "relative" }}
              >
                Xác nhận
              </button>
            </>
          )}
        </ConfirmationDialog>
        
           
            )}
          </ul>
        </div>
      </div>

      {selectedAppointment && (
        <div className="appointment-details">
          <div className="appointment-info">
           
            <span className="time">
              <FaCalendarAlt />{" "}
              {selectedAppointment.status === "confirmed"
                ? "Đã xác nhận"
                : "Đã đặt lịch"}
            </span>
          </div>
          <div className="details-header">
            <img
              src={
                doctorsInfo[selectedAppointment.doctor_id]?.imageUrl
                  ? `data:image/jpeg;base64,${
                      doctorsInfo[selectedAppointment.doctor_id].imageUrl
                    }`
                  : doctorPlaceholder
              }
              alt="Doctor"
              className="doctor-img"
            />
            <div className="doctor-info-app">
              <h3>
                {doctorsInfo[selectedAppointment.doctor_id]
                  ?
                   `${doctorsInfo[selectedAppointment.doctor_id].title} ${doctorsInfo[selectedAppointment.doctor_id].first_name} ${
                      doctorsInfo[selectedAppointment.doctor_id].last_name
                    }`
                  : "Bác sĩ không xác định"}
              </h3>
              <p>
                {doctorsInfo[selectedAppointment.doctor_id]?.address ||
                  "Địa chỉ không xác định"}
              </p>
            </div>
          </div>

          <div className="info-section">
            <h3>Thông tin đặt khám</h3>
            <div className="info-row">
              <p className="label">Mã phiếu khám:</p>
              <p className="value">{selectedAppointment._id}</p>
            </div>
            <div className="info-row">
              <p className="label">Ngày khám:</p>
              <p className="value">
                {new Date(
                  selectedAppointment.appointment_date
                ).toLocaleDateString()}
              </p>
            </div>
            <div className="info-row">
              <p className="label">Loại khám:</p>
              <p className="value">{selectedAppointment.appointment_type === 'online' ? 'Khám trực tuyến' : 'Khám trực tiếp'}</p>
            </div>
            <div className="info-row">
              <p className="label">Ghi chú:</p>
              <p className="value">{selectedAppointment.note}</p>
            </div>
          </div>

          <div className="info-section">
            <h3>Thông tin bệnh nhân</h3>
            <div className="info-row">
              <p className="label">Mã bệnh nhân:</p>
              <p className="value">
                {patientInfo ? patientInfo._id : "Không xác định"}
              </p>
            </div>
            <div className="info-row">
              <p className="label">Họ và tên:</p>
              <p className="value">
                {patientInfo
                  ? `${patientInfo.first_name} ${patientInfo.last_name}`
                  : "Không xác định"}
              </p>
            </div>
            <div className="info-row">
              <p className="label">Giới tính:</p>
              <p className="value">{patientInfo?.gender || "Không xác định"}</p>
            </div>
            <div className="info-row">
              <p className="label">Năm sinh:</p>
              <p className="value">
                {new Date(patientInfo?.birthdate).toLocaleDateString()}
              </p>
            </div>
            <div className="info-row">
              <p className="label">Điện thoại:</p>
              <p className="value">{patientInfo?.phone || "Không xác định"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
