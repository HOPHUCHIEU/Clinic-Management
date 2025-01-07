import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner"; // Import spinner từ react-bootstrap
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css"; // Import CSS của react-medium-image-zoom

const ViewDoctorDetail = ({ doctor, onClose }) => {
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading

  // Giả lập API hoặc xử lý dữ liệu khi component nhận prop
  useEffect(() => {
    if (doctor) {
      setIsLoading(false); // Dữ liệu đã load xong
    } else {
      setIsLoading(true); // Hiển thị loading khi không có dữ liệu
    }
  }, [doctor]);

  return (
    <>
      <Modal show={!!doctor} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin chi tiết</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {isLoading ? (
            // Hiển thị spinner khi đang loading
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spinner animation="border" variant="primary" />
              <p>Đang tải thông tin...</p>
            </div>
          ) : (
            doctor && (
              <>
                {/* Ảnh bác sĩ */}
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <Zoom>
                    <img
                      src={`data:image/jpeg;base64,${doctor.imageUrl}`}
                      alt={`${doctor.first_name} ${doctor.last_name}`}
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        cursor: "pointer",
                        objectPosition:"top",

                      }}
                    />
                  </Zoom>
                </div>

                {/* Thông tin cá nhân */}
                <p>
                  <strong>Họ tên:</strong> {doctor.first_name}{" "}
                  {doctor.last_name}
                </p>
                <p>
                  <strong>Chuyên ngành:</strong>{" "}
                  {doctor.specialties?.join(", ") || "Không có thông tin"}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {doctor.email || "Không có thông tin"}
                </p>
                <p>
                  <strong>Điện thoại:</strong>{" "}
                  {doctor.phone || "Không có thông tin"}
                </p>
                <p>
                  <strong>Địa chỉ:</strong>{" "}
                  {doctor.address || "Không có thông tin"}
                </p>
                <p>
                  <strong>Mô tả:</strong>{" "}
                  {doctor.description || "Không có thông tin"}
                </p>
                <p>
                  <strong>Kinh nghiệm:</strong>{" "}
                  {doctor.experience || "Không có thông tin"}
                </p>

                {/* Ảnh giấy chứng nhận */}
                <h5>Giấy chứng nhận:</h5>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  {doctor.certifications?.map((cert, index) => (
                    <Zoom key={index}>
                      <img
                        src={`data:image/jpeg;base64,${cert}`}
                        alt={`Certification ${index + 1}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "5px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          cursor: "pointer",
                          objectPosition:"top",

                        }}
                      />
                    </Zoom>
                  ))}
                </div>
              </>
            )
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// Định nghĩa propTypes
ViewDoctorDetail.propTypes = {
  doctor: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    specialties: PropTypes.arrayOf(PropTypes.string),
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    description: PropTypes.string,
    experience: PropTypes.string,
    imageUrl: PropTypes.string, // Base64 image
    certifications: PropTypes.arrayOf(PropTypes.string), // Array of base64 images
  }),
  onClose: PropTypes.func.isRequired,
};

export default ViewDoctorDetail;
