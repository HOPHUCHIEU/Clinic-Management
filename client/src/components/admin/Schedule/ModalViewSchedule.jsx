import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import "../../admin/Schedule/ModalViewSchedule.scss";

const ModalViewSchedule = ({ show, handleClose, schedule }) => {
  if (!schedule) return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Chi Tiết Lịch Khám</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Bác sĩ:</strong> {schedule.doctor_id.first_name}{" "}
          {schedule.doctor_id.last_name}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {schedule.doctor_id.email || "Chưa có thông tin"}
        </p>
        <p>
          <strong>Điện thoại:</strong>{" "}
          {schedule.doctor_id.phone || "Chưa có thông tin"}
        </p>
        <p>
          <strong>Chuyên môn:</strong>{" "}
          {schedule.doctor_id.specialties
            ? schedule.doctor_id.specialties.join(", ")
            : "Chưa có thông tin"}
        </p>
        <p>
          <strong>Kinh nghiệm:</strong>{" "}
          {schedule.doctor_id.experience || "Chưa có thông tin"}
        </p>
        <p>
          <strong>Ngày:</strong>{" "}
          {new Date(schedule.date).toLocaleDateString("vi-VN")}
        </p>
        <p>
          <strong>Giờ Bắt Đầu:</strong> {schedule.working_hours.start_time}
        </p>
        <p>
          <strong>Giờ Kết Thúc:</strong> {schedule.working_hours.end_time}
        </p>
        <p>
          <strong>Thời gian mỗi slot:</strong> {schedule.slot_duration} phút
        </p>
        <p>
          <strong>Các slot khả dụng:</strong>{" "}
          {schedule.available_slots.join(", ")}
        </p>
        <p>
          <strong>Các slot đã đặt:</strong>{" "}
          {schedule.booked_slots.length > 0
            ? schedule.booked_slots.join(", ")
            : "Chưa có slot nào được đặt"}
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ModalViewSchedule.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  schedule: PropTypes.shape({
    doctor_id: PropTypes.shape({
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      email: PropTypes.string,
      phone: PropTypes.string,
      specialties: PropTypes.array,
      experience: PropTypes.string,
    }).isRequired,
    date: PropTypes.string.isRequired,
    working_hours: PropTypes.shape({
      start_time: PropTypes.string.isRequired,
      end_time: PropTypes.string.isRequired,
    }).isRequired,
    slot_duration: PropTypes.number.isRequired,
    available_slots: PropTypes.array.isRequired,
    booked_slots: PropTypes.array.isRequired,
  }),
};

export default ModalViewSchedule;
