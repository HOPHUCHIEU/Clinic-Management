import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaTimesCircle } from "react-icons/fa";
import "../../style/Appointment/Appointment.scss";
import doctorPlaceholder from "../../assets/img/chuan1.png"; // Default image
import { getUserById } from "../../utils/AuthAPI/AdminService";
import {
  deleteAppointment,
  getAppointmentDoctor,
} from "../../utils/AppointmentAPI/AppointmentService";
import Countdown from "../../components/user/Appointment/Countdown";
import ConfirmationDialog from "../../components/layout/ConfirmationDialog"; // Confirmation dialog
import { toast } from "react-toastify";


const ViewSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patientsInfo, setPatientsInfo] = useState({});
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [countdownFinished, setCountdownFinished] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation dialog state
  const [appointmentToDelete, setAppointmentToDelete] = useState(null); // Appointment to delete

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointmentDoctor();
        const appointmentData = response;

        if (Array.isArray(appointmentData) && appointmentData.length > 0) {
          setAppointments(appointmentData);
          handleSelectAppointment(appointmentData[0]); // Default to the first appointment

          const patientsPromises = appointmentData.map(async (appointment) => {
            if (appointment.patient_id && appointment.patient_id._id) {
              try {
                const patientResponse = await getUserById(
                  appointment.patient_id._id,
                  "patient"
                );
                return {
                  id: appointment.patient_id._id,
                  info: patientResponse.user,
                };
              } catch (error) {
                console.error(
                  `Error fetching patient info for appointment ID ${appointment._id}:`,
                  error
                );
                return null;
              }
            } else {
              console.warn("Invalid appointment data:", appointment);
              return null;
            }
          });

          const patientsData = await Promise.all(patientsPromises);
          const validPatientsData = patientsData.filter((patient) => patient !== null);

          const patientsMap = validPatientsData.reduce((acc, patient) => {
            acc[patient.id] = patient.info;
            return acc;
          }, {});

          setPatientsInfo(patientsMap);
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
      const doctorResponse = await getUserById(appointment.doctor_id, "doctor");
      setDoctorInfo(doctorResponse.user);
    } catch (error) {
      console.error("Error fetching doctor info:", error);
    }
  };

  const handleCountdownEnd = (appointmentId) => {
    setCountdownFinished((prev) => ({
      ...prev,
      [appointmentId]: true, // Mark countdown as finished
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
    try {
      await deleteAppointment(appointmentToDelete); // Delete the selected appointment
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appt) => appt._id !== appointmentToDelete)
      );
      setSelectedAppointment(null);
      toast.success("Lịch hẹn đã được hủy thành công.");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Có lỗi xảy ra khi hủy lịch hẹn.");
    } finally {
      setShowConfirmation(false); // Close the confirmation dialog
      setAppointmentToDelete(null);
    }
  };

  const openConfirmationDialog = (appointmentId) => {
    setAppointmentToDelete(appointmentId);
    setShowConfirmation(true); // Open confirmation dialog
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setAppointmentToDelete(null);
  };

  const normalizeString = (str) => {
    return str
      .normalize("NFD") // Decompose accents
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .toLowerCase(); // Convert to lowercase
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (!appointment.patient_id || !appointment.patient_id._id) return false;

    const patientInfo = patientsInfo[appointment.patient_id._id];
    const patientName = `${patientInfo?.first_name || ""} ${patientInfo?.last_name || ""}`;
    const normalizedSearchTerm = normalizeString(searchTerm);

    return (
      normalizeString(patientName).includes(normalizedSearchTerm) ||
      normalizeString(appointment.appointment_type === 'online' ? 'Khám từ xa' : 'Khám tại phòng khám').includes(normalizedSearchTerm) ||
      
      normalizeString(appointment.time_slot).includes(normalizedSearchTerm) ||
      normalizeString(new Date(appointment.appointment_date).toLocaleDateString()).includes(normalizedSearchTerm) ||
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
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
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
                      {patientsInfo[appointment.patient_id._id]
                        ? `${
                            patientsInfo[appointment.patient_id._id].first_name
                          } ${
                            patientsInfo[appointment.patient_id._id].last_name
                          }`
                        : "Bệnh nhân không xác định"}
                    </h3>
                    <p>
                      {appointment.time_slot} -{" "}
                      {new Date(
                        appointment.appointment_date
                      ).toLocaleDateString()}
                    </p>
                    <h4 className="appointment-type">
                      {appointment.appointment_type === 'online' ? 'khám từ xa' : 'khám tại phòng khám'}
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
                          e.stopPropagation(); // Prevent li onClick
                          openConfirmationDialog(appointment._id); // Open confirmation dialog
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  {/* <span className="stt">STT: {appointment._id.slice(-2)}</span> */}
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
              />
            )}
          </ul>
        </div>
      </div>

      {selectedAppointment && (
        <div className="appointment-details">
          <div className="appointment-info">
            {/* <span className="stt">
              STT: {selectedAppointment._id.slice(-2)}
            </span> */}
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
                doctorInfo?.imageUrl
                  ? `data:image/jpeg;base64,${doctorInfo.imageUrl}`
                  : doctorPlaceholder
              }
              alt="Doctor"
              className="doctor-img"
            />
            <div className="doctor-info-app">
              <h3>
                {doctorInfo
                  ? `${doctorInfo.first_name} ${doctorInfo.last_name}`
                  : "Bác sĩ không xác định"}
              </h3>
              <p>{doctorInfo?.address || "Địa chỉ không xác định"}</p>
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
              <p className="value">{selectedAppointment.appointment_type === 'online' ? 'Khám từ xa' : 'Khám tại phòng khám'}</p>
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
                {patientsInfo[selectedAppointment.patient_id._id]?._id ||
                  "Không xác định"}
              </p>
            </div>
            <div className="info-row">
              <p className="label">Họ và tên:</p>
              <p className="value">
                {patientsInfo[selectedAppointment.patient_id._id]
                  ? `${
                      patientsInfo[selectedAppointment.patient_id._id]
                        .first_name
                    } ${
                      patientsInfo[selectedAppointment.patient_id._id]
                        .last_name
                    }`
                  : "Không xác định"}
              </p>
            </div>
            <div className="info-row">
              <p className="label">Giới tính:</p>
              <p className="value">
                {patientsInfo[selectedAppointment.patient_id._id]?.gender ||
                  "Không xác định"}
              </p>
            </div>
            <div className="info-row">
              <p className="label">Năm sinh:</p>
              <p className="value">
                {patientsInfo[selectedAppointment.patient_id._id]?.birthdate
                  ? new Date(
                      patientsInfo[selectedAppointment.patient_id._id]
                        .birthdate
                    ).toLocaleDateString()
                  : "Không xác định"}
              </p>
            </div>
            <div className="info-row">
              <p className="label">Điện thoại:</p>
              <p className="value">
                {patientsInfo[selectedAppointment.patient_id._id]?.phone ||
                  "Không xác định"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSchedule;
