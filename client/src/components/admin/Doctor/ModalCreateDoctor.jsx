import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../admin/Doctor/ModalCreateDoctor.scss";

const ModalCreateDoctor = ({
  show,
  handleClose,
  fetchDoctors,
  createDoctor,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "Nam",
    dob: "",
    phone: "",
    specialization: "",
    address: "",
    description: "",
    experience: "",
    doctorImage: null,
    certifications: [],
    password: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState([]);

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
        const base64Image = reader.result; // This will be in base64 format
        setImagePreview(base64Image);
        setFormData((prev) => ({
          ...prev,
          doctorImage: base64Image, // Store as base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertificateChange = (e) => {
    const files = Array.from(e.target.files);

    // Chuyển đổi mỗi file thành base64
    const previews = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    // Xử lý khi tất cả ảnh đã được chuyển đổi
    Promise.all(previews).then((newImages) => {
      setCertificatePreview((prev) => [...prev, ...newImages]); // Thêm ảnh mới vào danh sách xem trước
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, ...newImages], // Thêm ảnh mới vào dữ liệu form
      }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const {
      title,
      firstName,
      lastName,
      email,
      gender,
      dob,
      phone,
      specialization,
      address,
      description,
      experience,
      doctorImage,
      certifications,
      password,
    } = formData;
  
    // Name validation: Ensure no numbers
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      toast.error("Họ và tên không được chứa số hoặc ký tự không hợp lệ.");
      return;
    }
  
    // Date of birth validation: Ensure date is in the past
    const today = new Date();
    const birthDate = new Date(dob);
    if (birthDate >= today) {
      toast.error("Ngày sinh không hợp lệ.");
      return;
    }
  
    // Phone number validation: Must be 10-11 digits
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Số điện thoại phải chứa 10-11 chữ số.");
      return;
    }
  
    // General validation for required fields
    if (
      !title ||
      !firstName ||
      !lastName ||
      !email ||
      !gender ||
      !dob ||
      !phone ||
      !specialization ||
      !address ||
      !description ||
      !experience ||
      !doctorImage ||
      !password
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }
  
    try {
      const response = await createDoctor({
        title,
        first_name: firstName,
        last_name: lastName,
        email,
        gender,
        birthdate: dob,
        phone,
        specialties: specialization.split(",").map((spec) => spec.trim()),
        address,
        description,
        experience,
        doctorImage,
        certifications,
        password,
      });
  
      if (response.EC === 1) {
        fetchDoctors(1);
        toast.success(response.EM);
        handleClose();
        setFormData({
          title: "",
          firstName: "",
          lastName: "",
          email: "",
          gender: "Nam",
          dob: "",
          phone: "",
          specialization: "",
          address: "",
          description: "",
          experience: "",
          doctorImage: null,
          certifications: [],
          password: "",
        });
        setImagePreview(null);
        setCertificatePreview([]);
      } else {
        toast.error(response.EM || "Lỗi khi tạo bác sĩ.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.response?.data?.EM || "Lỗi khi tạo bác sĩ.");
    }
  };
  

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tạo Bác Sĩ Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formTitle">
                  <Form.Label>Chức danh</Form.Label>
                  <Form.Control
                    as="select"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn chức danh</option>
                    <option value="GS">GS</option>
                    <option value="PGS">PGS</option>
                    <option value="TS">TS</option>
                    <option value="ThS">ThS</option>
                  </Form.Control>
                </Form.Group>
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
                <Form.Group controlId="formSpecialization">
                  <Form.Label>Chuyên khoa</Form.Label>
                  <Form.Control
                    as="select"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn chuyên khoa</option>
                    <option value="Chuẩn Đoán Hình Ảnh">
                      Chuẩn Đoán Hình Ảnh
                    </option>
                    <option value="Xương Khớp">Xương Khớp</option>
                    <option value="Y Học Cổ Truyền">Y Học Cổ Truyền</option>
                    <option value="Da Liễu">Da Liễu</option>
                    <option value="Dị Ứng Miễn Dịch">Dị Ứng Miễn Dịch</option>
                    <option value="Lao Phổi">Lao Phổi</option>
                    <option value="Gây Mê Hồi Sức">Gây Mê Hồi Sức</option>
                    <option value="Lão Khoa">Lão Khoa</option>
                    <option value="Nhi Khoa">Nhi Khoa</option>
                    <option value="Huyết Học">Huyết Học</option>
                    <option value="Phẫu Thuật Thẩm Mỹ">
                      Phẫu Thuật Thẩm Mỹ
                    </option>
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

              <Col md={6}>
                <Form.Group controlId="formDescription">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
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
                <Form.Group controlId="formExperience">
                  <Form.Label>Kinh nghiệm</Form.Label>
                  <Form.Control
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Ảnh bác sĩ */}
            <Form.Group controlId="formDoctorImage" className="mt-3">
              <Form.Label>Ảnh bác sĩ</Form.Label>
              <Form.Control
                type="file"
                name="doctorImage"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              {imagePreview && (
                <div className="image-preview mt-2">
                  <img
                    src={imagePreview}
                    alt="Doctor preview"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
              )}
            </Form.Group>

            {/* Ảnh chứng nhận */}

            <Form.Group controlId="formcertifications" className="mt-3">
              <Form.Label>Ảnh chứng nhận</Form.Label>
              <Form.Control
                type="file"
                name="certifications"
                accept="image/*"
                multiple
                onChange={handleCertificateChange}
              />
              {certificatePreview.length > 0 && (
                <div className="certificate-preview mt-2">
                  {certificatePreview.map((src, index) => (
                    <div key={index} className="certificate-item">
                      <img src={src} alt={`Certificate ${index}`} />
                    </div>
                  ))}
                </div>
              )}
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Tạo Bác Sĩ
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

ModalCreateDoctor.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  fetchDoctors: PropTypes.func.isRequired,
  createDoctor: PropTypes.func.isRequired,
};

export default ModalCreateDoctor;
