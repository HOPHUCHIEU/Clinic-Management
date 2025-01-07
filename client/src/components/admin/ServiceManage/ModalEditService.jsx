import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalEditService = ({
  show,
  handleClose,
  fetchServices,
  updateService,
  editingService,
}) => {
  const [formData, setFormData] = useState({
    serviceName: "",
    servicePrice: "",
  });

  useEffect(() => {
    if (editingService) {
      setFormData({
        serviceName: editingService.name,
        servicePrice: editingService.price.toString(),
      });
    }
  }, [editingService]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { serviceName, servicePrice } = formData;

    if (!serviceName || !servicePrice) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const updatedService = {
        name: serviceName,
        price: parseFloat(servicePrice),
      };

      const response = await updateService(editingService._id, updatedService);
      if (response.success) {
        toast.success("Cập nhật dịch vụ thành công!");
        fetchServices(1);
        handleClose();
      } else {
        toast.error(response.message || "Lỗi khi cập nhật dịch vụ.");
      }
    } catch (error) {
      toast.error("Lỗi khi kết nối tới server.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh Sửa Dịch Vụ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formServiceName">
            <Form.Label>Tên dịch vụ</Form.Label>
            <Form.Control
              type="text"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formServicePrice">
            <Form.Label>Đơn giá</Form.Label>
            <Form.Control
              type="text"
              name="servicePrice"
              value={formData.servicePrice}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Cập nhật
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

ModalEditService.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  fetchServices: PropTypes.func.isRequired,
  updateService: PropTypes.func.isRequired,
  editingService: PropTypes.object,
};

export default ModalEditService;
