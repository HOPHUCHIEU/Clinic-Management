import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form } from "react-bootstrap";
import { toast ,ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalCreateService = ({
  show,
  handleClose,
  fetchServices,
  addNewService,
}) => {
  const [formData, setFormData] = useState({
    serviceName: "",
    servicePrice: "",
  });

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

    // Kiểm tra đơn giá có phải là số dương không
    if (isNaN(servicePrice) || parseFloat(servicePrice) <= 0) {
      toast.error("Đơn giá không hợp lệ.");
      return;
    }

    try {
      const newService = {
        name: serviceName,
        price: parseFloat(servicePrice),
      };

      const response = await addNewService(newService);
      if (response.success) {
        toast.success("Thêm dịch vụ thành công!");
        fetchServices(1);
        handleClose();
        setFormData({
          serviceName: "",
          servicePrice: "",
        });
      } else {
        toast.error(response.message || "Lỗi khi thêm dịch vụ.");
      }
    } catch (error) {
      toast.error("Lỗi khi kết nối tới server.");
    }
  };

  return (
    <>
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm Dịch Vụ Mới</Modal.Title>
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
            Thêm
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
    <ToastContainer></ToastContainer>
</>
  );
};

ModalCreateService.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  fetchServices: PropTypes.func.isRequired,
  addNewService: PropTypes.func.isRequired,
};

export default ModalCreateService;
