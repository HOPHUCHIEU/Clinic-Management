import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../style/DoctorList/DoctorList.scss";
import ReactPaginate from "react-paginate";
import {
  getAllUserByRole,
  getAllDoctorsBySpecialty,
} from "../../utils/AuthAPI/AdminService";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

const categories = [
  { name: "Tất cả" },
  { name: "Chuẩn Đoán Hình Ảnh" },
  { name: "Xương Khớp" },
  { name: "Y Học Cổ Truyền" },
  { name: "Da Liễu" },
  { name: "Dị Ứng Miễn Dịch" },
  { name: "Lao Phổi" },
  { name: "Gây Mê Hồi Sức" },
  { name: "Lão Khoa" },
  { name: "Nhi Khoa" },
  { name: "Huyết Học" },
  { name: "Phẫu Thuật Thẩm Mỹ" },
  { name: "Ngoại Thần Kinh" },
  { name: "Y Học Thể Thao" },
  { name: "Dinh Dưỡng" },
  { name: "Truyền Nhiễm" },
  { name: "Xét Nghiệm" },
  { name: "Hô Hấp" },
  { name: "Tâm Thần" },
  { name: "Sản Phụ Khoa" },
  { name: "Tai - Mũi - Họng" },
  { name: "Nội Thần Kinh" },
];

function DoctorList() {
  const location = useLocation();
  const { specialties } = location.state || {};
  const [doctorList, setDoctorList] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(
    specialties || "Tất cả"
  );
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const access_token = Cookies.get("access_token");
  if (!access_token) {
    return (
      <div className="login-message">
        <h1>Bạn cần đăng nhập để xem thông tin.</h1>
        <button
          className="login-btn_error"
          onClick={() => navigate("/login-register")}
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  // Hàm fetch dữ liệu bác sĩ theo chuyên khoa và trang
  const fetchDoctors = async (specialty = "Tất cả", page = 1) => {
    setLoading(true);
    try {
      let data;
      if (specialty === "Tất cả") {
        data = await getAllUserByRole("doctor", page, 10); // Lấy tất cả bác sĩ
      } else {
        data = await getAllDoctorsBySpecialty({ specialty, page, limit: 10 }); // Lấy bác sĩ theo chuyên khoa
      }

      // Nếu không có bác sĩ, cập nhật danh sách rỗng và hiển thị thông báo
      if (data && (data.doctors?.length > 0 || data.users?.length > 0)) {
        setDoctorList(data.doctors || data.users);
        setPageCount(data.totalPages || 1);
      } else {
        setDoctorList([]); // Đặt danh sách bác sĩ là mảng rỗng khi không có bác sĩ
        setPageCount(0); // Đảm bảo không có trang khi không có bác sĩ
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctorList([]); // Đặt danh sách bác sĩ là mảng rỗng khi có lỗi
      setPageCount(0); // Đảm bảo không có trang khi có lỗi
    } finally {
      setLoading(false);
    }
  };

  // Gọi hàm fetchDoctors khi component mount hoặc khi thay đổi danh mục hoặc trang
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchDoctors(currentCategory, currentPage + 1);
  }, [currentCategory, currentPage]);

  // Hàm thay đổi danh mục
  const handleChange = async (categoryName) => {
    setCurrentCategory(categoryName); // Cập nhật danh mục
    setCurrentPage(0); // Đặt lại trang về 0 (trang đầu tiên)
    await fetchDoctors(categoryName, 1); // Fetch lại bác sĩ cho danh mục mới và trang đầu tiên
  };

  // Hàm xử lý khi thay đổi trang
  const handlePageClick = async (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
    await fetchDoctors(currentCategory, selectedPage);
  };

  // Hàm xử lý khi click vào "Đặt khám"
  const handleAppointmentClick = (doctorId) => {
    const isLoggedIn = Cookies.get("access_token");
    if (!isLoggedIn) {
      navigate("/login-register");
    } else {
      navigate(`/dat-kham/bac-si/${doctorId}`);
    }
  };

  return (
    <div className="page-container">
      <aside className="sidebar-list">
        <nav>
          <ul>
            {categories.map((category, index) => (
              <li key={index}>
                <a
                  href="#"
                  className={currentCategory === category.name ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    handleChange(category.name);
                  }}
                >
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="doctor-list">
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : doctorList.length > 0 ? (
          doctorList.map((doctor) => (
            <div key={doctor._id} className="doctor-item">
              <img
                src={`data:image/jpeg;base64,${doctor.imageUrl}`}
                className="doctor-img"
                alt={`${doctor.first_name} ${doctor.last_name}`}
              />
              <div className="doctor-info">
                <h3>
                  {doctor.first_name} {doctor.last_name}
                </h3>
                <p>
                  {doctor.specialties.map((spec, index) => (
                    <span key={index} className="specialty">
                      {spec}
                    </span>
                  ))}
                </p>
                <p>{doctor.address}</p>
              </div>
              <button
                className="appointment-btn"
                onClick={() => handleAppointmentClick(doctor._id)}
              >
                Đặt khám
              </button>
            </div>
          ))
        ) : (
          <p>Không có bác sĩ trong khoa này.</p> // Thông báo khi không có bác sĩ
        )}

        <ReactPaginate
          nextLabel="Tiếp"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="Lùi"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination_doctorlist"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </main>
    </div>
  );
}

export default DoctorList;
