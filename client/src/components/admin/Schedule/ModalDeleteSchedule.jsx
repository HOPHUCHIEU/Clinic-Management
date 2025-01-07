import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

const ModalDeleteSchedule = ({ show, handleClose, handleDelete, selectedSchedule }) => {

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận xóa lịch khám</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedSchedule ? (
          <p>
            Bạn có chắc chắn muốn xóa lịch khám của bác sĩ{" "}
            {selectedSchedule.doctor_name} vào ngày{" "}
            {new Date(selectedSchedule.date).toLocaleDateString("vi-VN")} không?
          </p>
        ) : (
          <p>Không có thông tin lịch khám để xóa.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ModalDeleteSchedule.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  selectedSchedule: PropTypes.shape({
    doctor_name: PropTypes.string,
    date: PropTypes.string,
  }),
};

export default ModalDeleteSchedule;
