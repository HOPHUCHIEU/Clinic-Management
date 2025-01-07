import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalDeleteService = ({
  show,
  handleClose,
  fetchServices,
  deletingService,
  deleteService,
}) => {
  const handleDelete = async () => {
    if (!deletingService || !deletingService._id) {
      toast.error("Dịch vụ không hợp lệ.");
      return;
    }

    try {
      console.log("Deleting service:", deletingService);
      const response = await deleteService(deletingService._id);

      if (response) {
        console.log(response);

        toast.success("Dịch vụ đã được xóa thành công!");
        handleClose(); // Đóng modal trước khi làm mới danh sách
        await fetchServices(1); // Cập nhật danh sách dịch vụ
      } else {
        toast.error(response?.message || "Đã xảy ra lỗi khi xóa dịch vụ.");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Lỗi khi kết nối đến máy chủ.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xóa Dịch Vụ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Bạn có chắc chắn muốn xóa dịch vụ này?</p>
        {deletingService ? (
          <p>
            <strong>{deletingService.name}</strong>
          </p>
        ) : (
          <p>Thông tin dịch vụ không tồn tại.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={!deletingService}
        >
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ModalDeleteService.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  fetchServices: PropTypes.func.isRequired,
  deletingService: PropTypes.object,
  deleteService: PropTypes.func.isRequired,
};

export default ModalDeleteService;
