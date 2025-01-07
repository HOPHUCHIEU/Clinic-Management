import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalCreateMedicine = ({
  show,
  handleClose,
  fetchMedicines,
  addNewMedicine,
}) => {
  const [formData, setFormData] = useState({
    medicineName: "",
    medicineDes: "",
    unit: "Viên",
    medicinePrice: "",
    medicineQuantity: "",
    medicalImage: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          medicalImage: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      medicineName,
      medicineDes,
      unit,
      medicinePrice,
      medicineQuantity,
      medicalImage,
    } = formData;

    if (
      !medicineName ||
      !medicineDes ||
      !unit ||
      !medicinePrice ||
      !medicineQuantity
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // Kiểm tra đơn giá có phải là số dương không
    if (isNaN(medicinePrice) || parseFloat(medicinePrice) <= 0) {
      toast.error("Đơn giá không hợp lệ.");
      return;
    }

    // Kiểm tra số lượng có phải là số dương không
    if (isNaN(medicineQuantity) || parseInt(medicineQuantity, 10) <= 0) {
      toast.error("Số lượng không hợp lệ.");
      return;
    }

    try {
      const newMedicine = {
        name: medicineName,
        description: medicineDes,
        unit_of_caculation: unit,
        price: parseFloat(medicinePrice),
        quantity_available: parseInt(medicineQuantity, 10),
        medicalImage: medicalImage ? await convertToBase64(medicalImage) : null,
      };

      const response = await addNewMedicine(newMedicine);
      if (response.success) {
        toast.success("Thêm thuốc thành công!");
        fetchMedicines(1);
        handleClose();
        setFormData({
          medicineName: "",
          medicineDes: "",
          unit: "Viên",
          medicinePrice: "",
          medicineQuantity: "",
          medicalImage: null,
        });
        setImagePreview(null);
      } else {
        toast.error(response.message || "Lỗi khi thêm thuốc.");
      }
    } catch (error) {
      toast.error("Lỗi khi kết nối tới server.");
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Thuốc Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formMedicineName">
              <Form.Label>Tên thuốc</Form.Label>
              <Form.Control
                type="text"
                name="medicineName"
                value={formData.medicineName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formMedicineDes">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                type="text"
                name="medicineDes"
                value={formData.medicineDes}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUnit">
              <Form.Label>Đơn vị tính</Form.Label>
              <Form.Control
                as="select"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                required
              >
                <option value="Viên">Viên</option>
                <option value="Hộp">Hộp</option>
                <option value="Chai">Chai</option>
                <option value="Ống">Ống</option>
                <option value="Gói">Gói</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formMedicinePrice">
              <Form.Label>Đơn giá</Form.Label>
              <Form.Control
                type="text"
                name="medicinePrice"
                value={formData.medicinePrice}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formMedicineQuantity">
              <Form.Label>Số lượng</Form.Label>
              <Form.Control
                type="text"
                name="medicineQuantity"
                value={formData.medicineQuantity}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formMedicalImage">
              <Form.Label>Ảnh thuốc</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="image-preview mt-2">
                  <img
                    src={imagePreview}
                    alt="Medicine Preview"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
              )}
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

ModalCreateMedicine.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  fetchMedicines: PropTypes.func.isRequired,
  addNewMedicine: PropTypes.func.isRequired,
};

export default ModalCreateMedicine;
