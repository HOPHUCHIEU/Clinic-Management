import React from "react";
import PropTypes from "prop-types";
import { Modal, Button, ToastContainer } from "react-bootstrap";

const DeleteBlogModal = ({ show, onClose, onDelete, blogTitle }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận Xóa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Bạn có chắc chắn muốn xóa bài viết &quot;{blogTitle}&quot; không?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DeleteBlogModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  blogTitle: PropTypes.string.isRequired,
};

export default DeleteBlogModal;
