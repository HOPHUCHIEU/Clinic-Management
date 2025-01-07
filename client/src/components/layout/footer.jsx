import React from "react";
import "../../style/footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__section">
          <h4>CAPTONE 1 PROJECT</h4>
          <p>120 Hoàng Minh Thảo, Đà Nẵng</p>
          <p>
            Hotline: <a href="tel:0935038810">0935038810</a>
          </p>
          <p>Cline Management System</p>
          <p>Dũng - Nhân - Tính - Hiếu</p>
        </div>
        <div className="footer__section">
          <h4>Về CAPSTONE</h4>
          <ul>
            <li>
              <a href="/gioi-thieu">Giới thiệu về CAPSTONE 1</a>
            </li>
            <li>
              <a href="#">Thành viên nhóm</a>
            </li>
            <li>
              <a href="#">Thông tin dự án</a>
            </li>
            <li>
              <a href="tel:+84935038810">Liên hệ</a>
            </li>
          </ul>
        </div>
        <div className="footer__section">
          <h4>Dịch vụ</h4>
          <ul>
            <li>
              <a href="/tin-tuc">Tin tức y tế</a>
            </li>
            <li>
              <a href="/dat-kham/bac-si/:doctorId">Tư Vấn Trực Tuyến</a>
            </li>
            <li>
              <a href="#">Đặt khám Chuyên Khoa</a>
            </li>
            <li>
              <a href="/thong-tin/ho-so-benh-nhan">Hồ Sơ Bệnh Án</a>
            </li>
            <li>
              <a href="/dich-vu-kham">Dịch vụ Phòng Khám</a>
            </li>
          </ul>
        </div>
        <div className="footer__section">
          <h4>Hỗ trợ</h4>
          <ul>
            <li>
              <a href="http://localhost:5173/tin-tuc/bai-viet/67615cd15d747b6b87a5ef6a">Điều Khoản Sử Dụng</a>
            </li>
            <li>
              <a href="http://localhost:5173/tin-tuc/bai-viet/6761620a2c96719f3f1bc0b8">Chính Sách Bảo Mật</a>
            </li>
            <li>
              <a href="http://localhost:5173/tin-tuc/bai-viet/6761626c2c96719f3f1bc0da">Chính sách giải quyết khiếu nại</a>
            </li>
            <li>
              <a href="mailto:cskh@youmed.vn">Hỗ trợ khách hàng</a>
            </li>
            <li>
              <a href="mailto:tandung03.dev@gmail.com">Tư vấn khách hàng</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <p>
          Các thông tin trên Capstone1 chỉ dành cho mục đích tham khảo, tra cứu
          và không thay thế cho việc chẩn đoán hoặc điều trị y khoa.
        </p>
        <p>Cần tuyệt đối tuân theo hướng dẫn của Bác sĩ và Nhân viên y tế.</p>
        <p>Copyright © 2018 - 2024 Công ty TNHH Capstone1 Việt Nam.</p>
      </div>
    </footer>
  );
};

export default Footer;
