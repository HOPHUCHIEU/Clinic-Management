import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { editUser } from "../../../utils/AuthAPI/AdminService";
import { toast } from "react-toastify";
import "./ModalUpdateDoctor.scss";

const ModalEditDoctor = (props) => {
  const { showEditModal, setShowEditModal, selectedUser, fetchDoctors } = props;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    birthdate: "",
    gender: "",
    role: "doctor",
    specialties: "",
    title: "",
    description: "",
    experience: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        first_name: selectedUser.first_name || "",
        last_name: selectedUser.last_name || "",
        email: selectedUser.email || "",
        phone: selectedUser.phone || "",
        address: selectedUser.address || "",
        birthdate: selectedUser.birthdate || "",
        gender: selectedUser.gender || "",
        role: selectedUser.role || "doctor",
        specialties: selectedUser.specialties || "",
        title: selectedUser.title || "",
        description: selectedUser.description || "",
        experience: selectedUser.experience || "",
      });
    }
  }, [selectedUser]);

  const handleClose = () => {
    setErrors({});
    setShowEditModal(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: "" });
  };

  const validateFields = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    const phoneRegex = /^[0-9]{10,11}$/; // Chỉ cho phép 10-11 số
    const today = new Date();

    if (!formData.first_name || !nameRegex.test(formData.first_name.trim())) {
      newErrors.first_name = "First name không hợp lệ.";
    }
    if (!formData.last_name || !nameRegex.test(formData.last_name.trim())) {
      newErrors.last_name = "Last name không hợp lệ.";
    }
    if (!formData.email) {
      newErrors.email = "Email không được để trống.";
    }
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải từ 10-11 số.";
    }
    if (!formData.address) {
      newErrors.address = "Địa chỉ không được để trống.";
    }
    const birthdateObj = new Date(formData.birthdate);
    if (!formData.birthdate || birthdateObj > today) {
      newErrors.birthdate = "Ngày sinh không hợp lệ.";
    }
    if (!formData.gender) {
      newErrors.gender = "Giới tính không được để trống.";
    }
    if (!formData.specialties) {
      newErrors.specialties = "Chuyên môn không được để trống.";
    }
    if (!formData.title) {
      newErrors.title = "Chức danh không được để trống.";
    }
    if (!formData.description) {
      newErrors.description = "Mô tả không được để trống.";
    }
    if (!formData.experience) {
      newErrors.experience = "Kinh nghiệm không được để trống.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      const response = await editUser(selectedUser._id, formData);
      if (response.success) {
        handleClose();
        toast.success("Cập nhật thành công");
        fetchDoctors(1);
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra khi cập nhật.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật."
      );
    }
  };

  return (
    <Modal show={showEditModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh Sửa Thông Tin Bác Sĩ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="first_name">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                isInvalid={!!errors.first_name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.first_name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6" controlId="last_name">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                isInvalid={!!errors.last_name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.last_name}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6" controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                isInvalid={!!errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6" controlId="birthdate">
              <Form.Label>Birthdate</Form.Label>
              <Form.Control
                type="date"
                value={formData.birthdate}
                onChange={handleChange}
                isInvalid={!!errors.birthdate}
              />
              <Form.Control.Feedback type="invalid">
                {errors.birthdate}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="gender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                value={formData.gender}
                onChange={handleChange}
                isInvalid={!!errors.gender}
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.gender}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                as="select"
                value={formData.title}
                onChange={handleChange}
                isInvalid={!!errors.title}
              >
                <option value="">Chọn chức danh</option>
                <option value="GS">GS</option>
                <option value="PGS">PGS</option>
                <option value="TS">TS</option>
                <option value="ThS">ThS</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="specialties">
              <Form.Label>Specialties</Form.Label>
              <Form.Control
                as="select"
                name="specialties"
                value={formData.specialties}
                onChange={handleChange}
                isInvalid={!!errors.specialties}
                required
              >
                <option value="">Chọn chuyên khoa</option>
                <option value="Chuẩn Đoán Hình Ảnh">Chuẩn Đoán Hình Ảnh</option>
                <option value="Xương Khớp">Xương Khớp</option>
                <option value="Y Học Cổ Truyền">Y Học Cổ Truyền</option>
                <option value="Da Liễu">Da Liễu</option>
                <option value="Dị Ứng Miễn Dịch">Dị Ứng Miễn Dịch</option>
                <option value="Lao Phổi">Lao Phổi</option>
                <option value="Gây Mê Hồi Sức">Gây Mê Hồi Sức</option>
                <option value="Lão Khoa">Lão Khoa</option>
                <option value="Nhi Khoa">Nhi Khoa</option>
                <option value="Huyết Học">Huyết Học</option>
                <option value="Phẫu Thuật Thẩm Mỹ">Phẫu Thuật Thẩm Mỹ</option>
                <option value="Ngoại Thần Kinh">Ngoại Thần Kinh</option>
                <option value="Y Học Thể Thao">Y Học Thể Thao</option>
                <option value="Dinh Dưỡng">Dinh Dưỡng</option>
                <option value="Truyền Nhiễm">Truyền Nhiễm</option>
                <option value="Xét Nghiệm">Xét Nghiệm</option>
                <option value="Hô Hấp">Hô Hấp</option>
                <option value="Tâm Thần">Tâm Thần</option>
                <option value="Sản Phụ Khoa">Sản Phụ Khoa</option>
                <option value="Tai - Mũi - Họng">Tai - Mũi - Họng</option>
                <option value="Nội Thần Kinh">Nội Thần Kinh</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.specialties}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6" controlId="experience">
              <Form.Label>Experience</Form.Label>
              <Form.Control
                type="text"
                placeholder="Experience"
                value={formData.experience}
                onChange={handleChange}
                isInvalid={!!errors.experience}
              />
              <Form.Control.Feedback type="invalid">
                {errors.experience}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ModalEditDoctor.propTypes = {
  showEditModal: PropTypes.bool.isRequired,
  setShowEditModal: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  fetchDoctors: PropTypes.func.isRequired,
};

export default ModalEditDoctor;
