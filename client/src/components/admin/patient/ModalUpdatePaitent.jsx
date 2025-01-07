import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { editUser } from "../../../utils/AuthAPI/AdminService";
import { toast } from "react-toastify";

const ModalEditPatient = (props) => {
  const {
    showEditModal,
    setShowEditModal,
    selectedUser,
    fetchPatients,
  } = props;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    birthdate: "",
    gender: "",
    role: "patient",
    specialties: "",
  });

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
        role: selectedUser.role || "patient",
        specialties: selectedUser.specialties?.join(", ") || "",
      });
    }
  }, [selectedUser]);

  const handleClose = () => setShowEditModal(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    // Regular expressions for validation
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/; // Chỉ cho phép chữ cái và khoảng trắng
    const phoneRegex = /^[0-9]{10,11}$/; // Chỉ cho phép số, dài từ 10-11 ký tự

    // Kiểm tra họ tên
    if (!nameRegex.test(formData.first_name)) {
      toast.error("Họ không được chứa ký tự số hoặc ký tự đặc biệt.");
      return false;
    }

    if (!nameRegex.test(formData.last_name)) {
      toast.error("Tên không được chứa ký tự số hoặc ký tự đặc biệt.");
      return false;
    }

    // Kiểm tra số điện thoại
    if (!phoneRegex.test(formData.phone)) {
      toast.error(
        "Số điện thoại không hợp lệ. Chỉ cho phép số, từ 10-11 ký tự."
      );
      return false;
    }

    // Kiểm tra ngày sinh
    const birthdate = new Date(formData.birthdate);
    const today = new Date();
    if (birthdate > today) {
      toast.error("Ngày sinh không được lớn hơn ngày hiện tại.");
      return false;
    }

    return true; // Nếu tất cả các điều kiện hợp lệ
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return; // Dừng lại nếu form không hợp lệ
    }

    try {
      const response = await editUser(selectedUser._id, formData);
      if (response.success) {
        handleClose(); // Đóng modal
        toast.success(response.message);
        await fetchPatients(1); // Refresh lại danh sách bệnh nhân
      } else {
        toast.error(response.message || "Có lỗi xảy ra.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Lỗi khi cập nhật thông tin.");
    }
  };

  return (
    <>
      <Modal show={showEditModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh Sửa Bệnh Nhân</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col md={8}>
              <Form noValidate>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="first_name">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="First Name"
                      value={formData.first_name}
                      onChange={handleChange}
                      isInvalid={!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.first_name)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Họ không được chứa ký tự số hoặc ký tự đặc biệt.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="6" controlId="last_name">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Last Name"
                      value={formData.last_name}
                      onChange={handleChange}
                      isInvalid={!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.last_name)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Tên không được chứa ký tự số hoặc ký tự đặc biệt.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      required
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="6" controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                      isInvalid={!/^[0-9]{10,11}$/.test(formData.phone)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Số điện thoại chỉ cho phép số, từ 10-11 ký tự.
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
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="6" controlId="birthdate">
                    <Form.Label>Birthdate</Form.Label>
                    <Form.Control
                      required
                      type="date"
                      value={formData.birthdate}
                      onChange={handleChange}
                      isInvalid={new Date(formData.birthdate) > new Date()}
                    />
                    <Form.Control.Feedback type="invalid">
                      Ngày sinh không được lớn hơn ngày hiện tại.
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
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </Form.Control>
                  </Form.Group>
                </Row>
              </Form>
            </Col>

            <Col md={4} className="d-flex flex-column align-items-center">
              <div className="image-preview mb-3">
                {selectedUser?.imageUrl ? (
                  <img
                    src={`data:image/jpeg;base64,${selectedUser.imageUrl}`}
                    alt="Patient preview"
                    style={{
                      width: "250px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src="placeholder-image-url"
                    alt="Patient preview"
                    style={{
                      width: "150px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
              <Button variant="primary" onClick={handleSave}>
                Lưu
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

ModalEditPatient.propTypes = {
  showEditModal: PropTypes.bool.isRequired,
  setShowEditModal: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  fetchPatients: PropTypes.func,
};

export default ModalEditPatient;
