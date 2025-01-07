import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalDeleteMedicine = ({
  show,
  handleClose,
  fetchMedicines,
  deletingMedicine,
  deleteMedicine,
}) => {
  const handleDelete = async () => {
    try {
      const response = await deleteMedicine(deletingMedicine._id);
      if (response.success) {
        toast.success("Xóa thuốc thành công!");
        fetchMedicines(1);
        handleClose();
      } else {
        toast.error(response.message || "Lỗi khi xóa thuốc.");
      }
    } catch (error) {
      toast.error("Lỗi khi kết nối tới server.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xóa Thuốc</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Bạn có chắc chắn muốn xóa thuốc này?</p>
        <p>
          <strong>{deletingMedicine?.name}</strong>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ModalDeleteMedicine.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  fetchMedicines: PropTypes.func.isRequired,
  deletingMedicine: PropTypes.object,
  deleteMedicine: PropTypes.func.isRequired,
};

export default ModalDeleteMedicine;
