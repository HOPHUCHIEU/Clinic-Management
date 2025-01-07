import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalCreatePatient = ({
  show,
  handleClose,
  fetchPatients,
  createPatient,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "Nam",
    dob: "",
    phone: "",
    address: "",
    password: "",
    patientImage: null,
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
          patientImage: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      gender,
      dob,
      phone,
      address,
      password,
      patientImage,
    } = formData;

    // Kiểm tra hợp lệ
    const nameRegex = /^[\p{L}\s]+$/u; // Hỗ trợ ký tự Unicode
    const phoneRegex = /^[0-9]{10,11}$/; // Chỉ chấp nhận số có 10 hoặc 11 ký tự
    const today = new Date();

    if (!firstName || !nameRegex.test(firstName.trim())) {
      toast.error("Họ không hợp lệ. Vui lòng không nhập số hoặc ký tự đặc biệt.");
      return;
    }

    if (!lastName || !nameRegex.test(lastName.trim())) {
      toast.error("Tên không hợp lệ. Vui lòng không nhập số hoặc ký tự đặc biệt.");
      return;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Email không hợp lệ.");
      return;
    }

    const dobDate = new Date(dob);
    if (!dob || dobDate > today) {
      toast.error("Ngày sinh không hợp lệ.");
      return;
    }

    if (!phone || !phoneRegex.test(phone.trim())) {
      toast.error("Số điện thoại không hợp lệ.");
      return;
    }

    if (!address) {
      toast.error("Địa chỉ không được để trống.");
      return;
    }

    if (!password || password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (!patientImage) {
      toast.error("Vui lòng chọn ảnh bệnh nhân.");
      return;
    }

    // Chuẩn bị dữ liệu và gửi yêu cầu
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      try {
        const response = await createPatient({
          first_name: firstName,
          last_name: lastName,
          email,
          gender,
          birthdate: dob,
          phone,
          address,
          password,
          patientImage: base64Image,
        });

        if (response.success) {
          toast.success("Bệnh nhân được tạo thành công!");
          fetchPatients(1);
          handleClose();
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            gender: "Nam",
            dob: "",
            phone: "",
            address: "",
            password: "",
            patientImage: null,
          });
          setImagePreview(null);
        } else {
          toast.error(response.message || "Lỗi khi tạo bệnh nhân.");
        }
      } catch (error) {
        toast.error("Lỗi khi kết nối tới server.");
      }
    };
    reader.readAsDataURL(patientImage);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Tạo Bệnh Nhân Mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formFirstName">
                <Form.Label>Họ</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formGender">
                <Form.Label>Giới tính</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formLastName">
                <Form.Label>Tên</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formDob">
                <Form.Label>Ngày sinh</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formAddress">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formPatientImage" className="mt-3">
            <Form.Label>Ảnh bệnh nhân</Form.Label>
            <Form.Control
              type="file"
              name="patientImage"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {imagePreview && (
              <div className="image-preview mt-2">
                <img
                  src={imagePreview}
                  alt="Patient preview"
                  style={{
                    width: "150px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            )}
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Tạo Bệnh Nhân
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

ModalCreatePatient.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  fetchPatients: PropTypes.func.isRequired,
  createPatient: PropTypes.func.isRequired,
};

export default ModalCreatePatient;
