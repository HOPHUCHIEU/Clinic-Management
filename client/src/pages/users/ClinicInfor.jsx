import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../style/ClinicInfor/ClinicInfor.scss";
import { getAllServices } from "../../services/serviceAPI";
import xuongkhop from "../../assets/img/Blog_Image/1 9.png"
const subject = encodeURIComponent("Chào mừng bạn đến với phòng khám");
const body = encodeURIComponent(
  "Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email này hoặc qua số điện thoại: +84 935038810"
);

const ClinicInfo = () => {
  const [services, setServices] = useState([]); // State để lưu danh sách dịch vụ
  const [error, setError] = useState(""); // State để lưu thông báo lỗi nếu có

  // Gọi API để lấy danh sách dịch vụ
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllServices(1, 10); // Gọi API với page=1, limit=10
        console.log("API Response:", response); // Debug phản hồi API
        if (response) {
          setServices(response.services); // Lưu danh sách dịch vụ
        } else {
          setError("Không có dịch vụ nào được tìm thấy.");
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", err);
        setError("Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.");
      }
    };
  
    fetchServices();
  }, []);
  

  return (
    <Container className="clinic-info-page">
      <h1 className="text-center my-4">Giới Thiệu Về Phòng Khám</h1>

      {/* Clinic Information Section */}
      <Row className="my-5">
        <Col md={6}>
          <Card className="info-card">
            <Card.Body>
              <image 
              style={
                {width: "100%",
                height: "auto",
                objectFit: "cover"}
              }
              src={xuongkhop}></image>
              <Card.Title>Thông Tin Phòng Khám</Card.Title>
              <Card.Text>
                <strong>Địa chỉ:</strong> 123 Đường Y Tế, Quận 1, TP. HCM
              </Card.Text>
              <Card.Text>
                <strong>Số điện thoại:</strong> +84 123 456 789
              </Card.Text>
              <Card.Text>
                <strong>Email:</strong> lienhe@phongkham.com
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Opening Hours Section */}
        <Col md={6}>
          <Card className="info-card">
            <Card.Body>
              <Card.Title>Giờ Mở Cửa</Card.Title>
              <ul className="opening-hours">
                <li>Thứ 2 - Thứ 6: 08:00 - 18:00</li>
                <li>Thứ 7: 08:00 - 12:00</li>
                <li>Chủ nhật: Đóng cửa</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Services Section */}
      <Row className="my-5">
  <Col>
    <Card className="info-card">
      <Card.Body>
        <Card.Title>Các Dịch Vụ Tại Phòng Khám</Card.Title>
        {error ? (
          <p className="text-danger">{error}</p>
        ) : services.length > 0 ? (
          <table className="service-table">
            <thead>
              <tr>
                <th>Tên dịch vụ</th>
                <th>Giá (VND)</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td>{service.name}</td>
                  <td>{service.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Đang tải danh sách dịch vụ...</p>
        )}
      </Card.Body>
    </Card>
  </Col>
</Row>


      {/* Contact Section */}
      <Row className="my-5">
        <Col>
          <Card className="info-card">
            <Card.Body>
              <Card.Title>Liên Hệ Với Chúng Tôi</Card.Title>
              <Card.Text>
                Nếu bạn có bất kỳ câu hỏi nào hoặc cần hỗ trợ, vui lòng liên hệ
                với chúng tôi qua thông tin bên dưới. Chúng tôi sẽ phản hồi
                nhanh chóng và hỗ trợ bạn tốt nhất.
              </Card.Text>
              <Button
                onClick={() => {
                  window.location.href = `mailto:tandung03.dev@gmail.com?subject=${subject}&body=${body}`;
                }}
                variant="primary"
              >
                Gửi Email
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ClinicInfo;
