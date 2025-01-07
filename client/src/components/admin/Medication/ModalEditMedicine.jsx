import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalEditMedicine = ({
  show,
  handleClose,
  fetchMedicines,
  updateMedicine,
  editingMedicine,
}) => {
  const [formData, setFormData] = useState({
    medicineName: "",
    medicineDes: "",
    unit: "vien",
    medicinePrice: "",
    medicineQuantity: "",
    medicalImage: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (editingMedicine) {
      setFormData({
        medicineName: editingMedicine.name || "",
        medicineDes: editingMedicine.description || "",
        unit: editingMedicine.unit_of_caculation || "vien",
        medicinePrice: editingMedicine?.price
          ? editingMedicine?.price?.toString()
          : "",
        medicineQuantity: editingMedicine?.quantity_available
          ? editingMedicine?.quantity_available?.toString()
          : "",
        medicalImage: editingMedicine?.medicalImage || null,
      });
      setImagePreview(editingMedicine?.medicalImage);
    }
  }, [editingMedicine]);

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
      const updatedMedicine = {
        name: medicineName,
        description: medicineDes,
        unit_of_caculation: unit,
        price: parseFloat(medicinePrice),
        quantity_available: parseInt(medicineQuantity, 10),
        medicalImage:
          medicalImage instanceof File || medicalImage instanceof Blob
            ? await convertToBase64(medicalImage)
            : medicalImage,
      };

      const response = await updateMedicine(
        editingMedicine._id,
        updatedMedicine
      );
      if (response.success) {
        toast.success("Cập nhật thuốc thành công!");
        fetchMedicines(1);
        handleClose();
      } else {
        toast.error(response.message || "Lỗi khi cập nhật thuốc.");
      }
    } catch (error) {
      console.error("Error updating medicine:", error);
      toast.error("Lỗi khi kết nối tới server.");
    }
  };

  const convertToBase64 = (file) => {
    if (!(file instanceof File || file instanceof Blob)) {
      console.error("Invalid file type", file);
      return Promise.reject(new Error("Invalid file type"));
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh Sửa Thuốc</Modal.Title>
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
              <option value="vien">Viên</option>
              <option value="hop">Hộp</option>
              <option value="chai">Chai</option>
              <option value="ong">Ống</option>
              <option value="goi">Gói</option>
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
            Cập nhật
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

ModalEditMedicine.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  fetchMedicines: PropTypes.func.isRequired,
  updateMedicine: PropTypes.func.isRequired,
  editingMedicine: PropTypes.object,
};

export default ModalEditMedicine;
