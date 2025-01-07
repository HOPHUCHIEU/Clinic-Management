import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form } from "react-bootstrap";

const ModalUpdateSchedule = ({
  show,
  handleClose,
  handleUpdate,
  selectedSchedule,
}) => {
  // Local state for each editable field
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotDuration, setSlotDuration] = useState("");

  useEffect(() => {
    if (selectedSchedule) {
      setStartTime(selectedSchedule.start_time);
      setEndTime(selectedSchedule.end_time);
      setSlotDuration(selectedSchedule.slot_duration);
    }
  }, [selectedSchedule]);

  // Function to handle form submission
  const handleSubmit = () => {
   const updatedSchedule = {
    _id: selectedSchedule.schedule_id, // Ensure this is correct
    date: selectedSchedule.date,
    working_hours: {
        start_time: startTime,
        end_time: endTime,
    },
    slot_duration: parseInt(slotDuration, 10), // Ensure this is a number
};
    handleUpdate(updatedSchedule);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cập Nhật Lịch</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="doctor_id">
            <Form.Label>Tên Bác sĩ</Form.Label>
            <Form.Control
              type="text"
              value={selectedSchedule?.doctor_name || ""}
              disabled
            />
          </Form.Group>
          <Form.Group controlId="date">
            <Form.Label>Ngày làm việc</Form.Label>
            <Form.Control
              type="text"
              value={
                selectedSchedule?.date
                  ? new Date(selectedSchedule.date).toISOString().split("T")[0]
                  : ""
              }
              disabled
            />
          </Form.Group>

          <Form.Group controlId="start_time">
            <Form.Label>Giờ Bắt Đầu</Form.Label>
            <Form.Control
              type="text"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="end_time">
            <Form.Label>Giờ Kết Thúc</Form.Label>
            <Form.Control
              type="text"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="slot_duration">
            <Form.Label>Thời gian mỗi slot (phút)</Form.Label>
            <Form.Control
              type="text"
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Cập Nhật
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ModalUpdateSchedule.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func,
  selectedSchedule: PropTypes.object,
};

export default ModalUpdateSchedule;
