import image1 from "../../assets/img/image1.png";
import avatar from "../../assets/img/1237b30268db9ee0c9cbe3a79b1ff8fa.jpg";
import "../../style/homepage.scss";
import { CiSearch } from "react-icons/ci";
import doctorImage from "../../assets/img/customer01.png";
import image2 from "../../assets/img/coth1.png";
import image from "../../assets/img/chuan1.png";
import { useNavigate } from "react-router-dom";
import { getAllUserByRole } from "../../utils/AuthAPI/AdminService";
import { useEffect, useState } from "react";
import ChandoanhinhanhIMG from "../../assets/img/Specialties/Chandoanhinhanh.jpg";
import Coxuongkhop from "../../assets/img/Specialties/Coxuongkhop.jpg";
import Dalieu from "../../assets/img/Specialties/Dalieu.jpg";
import Diungmiendich from "../../assets/img/Specialties/Diungmiendich.jpg";
import Gaymehoisuc from "../../assets/img/Specialties/Gaymehoisuc.jpg";
import Hohap from "../../assets/img/Specialties/Hohap.jpg";
import laobenhphoi from "../../assets/img/Specialties/laobenhphoi.jpg";
import laokhoa from "../../assets/img/Specialties/laokhoa.jpg";
import Nhikhoa from "../../assets/img/Specialties/Nhikhoa (1).jpg";
import sanphukhoa from "../../assets/img/Specialties/sanphukhoa.jpg";
import taimuihong from "../../assets/img/Specialties/taimuihong.jpg";
import tamthan from "../../assets/img/Specialties/tamthan.jpg";
import truyennhiem from "../../assets/img/Specialties/truyennhiem.jpg";
import xetnghiem from "../../assets/img/Specialties/xetnghiem.jpg";
import huyethoc from "../../assets/img/Specialties/huyet-hoc.jpg";
import yhoccotruyen from "../../assets/img/Specialties/Yhoccotruyen.jpg";
import yhocthethao from "../../assets/img/Specialties/yhocthethao.jpg";
import phauthuatthammy from "../../assets/img/Specialties/37_phauthuattaohinhthammy.jpg";
import ngoaithankinh from "../../assets/img/Specialties/Ngoaithankinh.jpg";
import noitonquat from "../../assets/img/Specialties/Noitongquat.jpg";
import dinhduong from "../../assets/img/Specialties/Dinhduong.jpg";
// import Chatbot from "../../components/chatbot/Chatbot";
import chungnhan1 from "../../assets/img/chungnhan1.jpg";
import chungnhan2 from "../../assets/img/chungnhan2.jpg";
import chungnhan3 from "../../assets/img/chungnhan3.jpg";
import chungnhan4 from "../../assets/img/chungnhan4.jpg";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "../../style/Medicines/Medicines.scss";
import Modal from "./ModalMedicine";

import noithankinh from "../../assets/img/Specialties/noithankinh.jpg";
import { ToastContainer } from "react-toastify";
// import ngoailongngucmanhmau from "../../assets/img/Specialties/ngoailongngucmanhmau.jpg";

const HomePage = () => {
  //xem chi tiết thuốc
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (medicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedicine(null);
  };

  // thuốc
  const [medicines, setMedicines] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State lưu giá trị tìm kiếm
  const limit = 7;

  // Fetch medicines function
  const fetchMedicines = async (page = 1, keyword = "") => {
    try {
      const url = keyword
        ? `http://localhost:8000/api/medicines/all-medicines?page=${page}&limit=${limit}&search=${keyword}`
        : `http://localhost:8000/api/medicines/all-medicines?page=${page}&limit=${limit}`;

      const response = await axios.get(url);
      if (response.data.success) {
        setMedicines(response.data.medicines);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } else {
        console.error("Failed to fetch medicines:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // Nếu người dùng nhấn Enter, gọi hàm tìm kiếm
      fetchMedicines(1, searchKeyword.trim());
    }
  };

  const handleSearchChange = (event) => {
    const keyword = event.target.value;
    setSearchKeyword(keyword);

    // Nếu ô tìm kiếm rỗng, gọi API để lấy toàn bộ danh sách thuốc
    if (keyword.trim() === "") {
      fetchMedicines(1); // Gọi API mà không có tham số search
    }
  };

  const handleSearch = () => {
    fetchMedicines(1, searchKeyword.trim()); // Gửi từ khóa tìm kiếm (hoặc rỗng nếu xóa)
  };

  // Effect to fetch data when the page changes
  useEffect(() => {
    fetchMedicines(currentPage);
  }, [currentPage]);

  // Handle pagination click
  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1; // ReactPaginate pages are 0-indexed
    setCurrentPage(selectedPage);
  };
  // kêt thúc thuốc

  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const handleBookingBySpecialties = (specialty) => {
    navigate(
      {
        pathname: "/dat-kham/bac-si/tim-kiem",
      },
      {
        state: {
          specialties: specialty,
        },
      }
    );
  };
  const handleBooking = (doctorID) => {
    navigate(`/dat-kham/bac-si/${doctorID}`);
  };
  const handleViewMoreClick = () => {
    setIsExpanded(!isExpanded);
  };
  const handleViewmore = () => {
    navigate("/dat-kham/bac-si/tim-kiem");
  };
  const [doctors, setDoctor] = useState([]);
  useEffect(() => {
    fetchDoctors(); // Gọi hàm fetchDoctors
  }, []); // Thêm dependency array để hàm chỉ chạy một lần khi component mount

  const fetchDoctors = async () => {
    try {
      const data = await getAllUserByRole("doctor", 1, 20); // Gọi API
      setDoctor(data.users);
    } catch (error) {
      console.log(error); // Log lỗi nếu có
    }
  };
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const handleSearchDoctorDetails = () => {
    if (searchQuery.trim()) {
      navigate(`/doctor-list?search=${encodeURIComponent(searchQuery)}`); // Điều hướng đến /doctor-list với query
    } else {
      navigate(`/doctor-list`); // Nếu không có query, chỉ chuyển đến /doctor-list
    }
  };
  return (
    <>
      <div className="body-homepage">
        <div className="description-search-container">
          <p className="description_1">Ứng dụng đặt khám </p>
          <p className="description_2">
            Đặt khám với hơn 600 bác sỹ, 160 bệnh nhân, 56 phòng khám trên
            Pandora để có số thứ tự và khung giờ khám trước.
          </p>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Nhập bác sĩ và khoa muốn tìm kiếm... "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật giá trị state
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchDoctorDetails(); // Gọi hàm khi nhấn Enter
                }
              }}
            />
            <CiSearch
              className="search-icon"
              onClick={handleSearchDoctorDetails}
            />{" "}
            {/* Gọi hàm khi click icon */}
          </div>
        </div>

        <img src={image1} className="img-home-page" />
      </div>
      <div className="booking_container">
        <div className="booking_header">
          <p className="title">Đặt lịch phòng khám trực tuyến</p>
          <p className="description">
            Tìm bác sĩ chính xác - Đặt lịch khám dễ dàng
          </p>
        </div>
        <div className="booking_doctor">
          <div className="action">
            <div>
              <p className="booking_title">Đặt khám bác sĩ</p>
              <p className="booking_info">
                Đa dạng phòng khám với nhiều chuyên khoa khác nhau như Sản -
                Nhi, Tai Mũi họng, Da Liễu, Tiêu Hoá...
              </p>
            </div>
            <div>
              <button className="view-more-button" onClick={handleViewmore}>
                Xem Thêm &gt;
              </button>
            </div>
          </div>
          <div className="doctor-cards">
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <div className="doctor-card" key={doctor._id}>
                  <div className="doctor-image">
                    <img
                      src={`data:image/jpeg;base64,${doctor.imageUrl}`}
                      alt="Doctor Avatar"
                    />
                  </div>
                  <div className="doctor-info">
                    <h3>
                      {doctor.first_name} {doctor.last_name}
                    </h3>
                    <p>{doctor.specialties.join(", ")}</p>
                    <p>{doctor.address}</p>
                  </div>
                  <div className="doctor-action">
                    <button onClick={() => handleBooking(doctor._id)}>
                      Đặt lịch khám
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Không tìm thấy bác sĩ nào</p>
            )}
          </div>
        </div>
        <div className="booking_specialty">
          <div className="action">
            <p className="booking_title">Đặt Lịch theo Chuyên khoa</p>
            <p className="booking_content">
              Danh sách bác sĩ, bệnh viện, phòng khám, theo chuyên khoa{" "}
            </p>
          </div>
          <div className={`specialty-cards ${isExpanded ? "expanded" : ""}`}>
            {" "}
            <div
              className="specialty-card"
              value="Chuẩn Đoán Hình Ảnh"
              onClick={(e) => {
                handleBookingBySpecialties("Chuẩn Đoán Hình Ảnh");
              }}
            >
              {/* <div className="specialty-card"> */}
              <div className="specialty-image">
                <img src={ChandoanhinhanhIMG} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Chuẩn Đoán Hình Ảnh</span>
              </div>
              {/* </div> */}
            </div>
            <div
              className="specialty-card"
              value="Cơ Xương Khớp"
              onClick={(e) => {
                handleBookingBySpecialties("Cơ Xương Khớp");
              }}
            >
              {/* <div className="specialty-card"> */}
              <div className="specialty-image">
                <img src={Coxuongkhop} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Xương Khớp</span>
              </div>
              {/* </div> */}
            </div>
            <div
              className="specialty-card"
              value="Y Học Cổ Truyền"
              onClick={(e) => {
                handleBookingBySpecialties("Y Học Cổ Truyền");
              }}
            >
              {" "}
              {/* <div className="specialty-card"> */}
              <div className="specialty-image">
                <img src={yhoccotruyen} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Y Học Cổ Truyền</span>
              </div>
              {/* </div> */}
            </div>
            <div
              className="specialty-card"
              value="Da Liễu"
              onClick={(e) => {
                handleBookingBySpecialties("Da Liễu");
              }}
            >
              {/* <div className="specialty-card"> */}
              <div className="specialty-image">
                <img src={Dalieu} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Da Liễu</span>
              </div>
              {/* </div> */}
            </div>
            <div
              className="specialty-card"
              value="Dị Ứng Miễn Dịch"
              onClick={(e) => {
                handleBookingBySpecialties("Dị Ứng Miễn Dịch");
              }}
            >
              {/* <div className="specialty-card"> */}
              <div className="specialty-image">
                <img src={Diungmiendich} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Dị Ứng Miễn Dịch</span>
              </div>
              {/* </div> */}
            </div>
            <div
              className="specialty-card"
              value="Lao Phổi"
              onClick={(e) => {
                handleBookingBySpecialties("Lao Phổi");
              }}
            >
              {/* <div className="specialty-card"> */}
              <div className="specialty-image">
                <img src={laobenhphoi} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Lao Phổi</span>
              </div>
              {/* </div> */}
            </div>
            <div
              className="specialty-card"
              value="Gây Mê Hồi Sức"
              onClick={(e) => {
                handleBookingBySpecialties("Gây Mê Hồi Sức");
              }}
            >
              {/* <div className="specialty-card"> */}
              <div className="specialty-image">
                <img src={Gaymehoisuc} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Gây Mê Hồi Sức</span>
              </div>
              {/* </div> */}
            </div>
            <div
              className="specialty-card"
              value="Lão Khoa"
              onClick={(e) => {
                handleBookingBySpecialties("Lão Khoa");
              }}
            >
              {" "}
              {/* <div className="specialty-card"> */}
              <div className="specialty-image">
                <img src={laokhoa} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Lão Khoa</span>
              </div>
              {/* </div> */}
            </div>
            <div
              className="specialty-card"
              value="Nhi khoa"
              onClick={(e) => {
                handleBookingBySpecialties("Nhi Khoa");
              }}
            >
              <div className="specialty-image">
                <img src={Nhikhoa} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Nhi khoa</span>
              </div>
            </div>
            <div
              className="specialty-card"
              value="Huyết Học"
              onClick={(e) => {
                handleBookingBySpecialties("Huyết Học");
              }}
            >
              <div className="specialty-image">
                <img src={huyethoc} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Huyết Học</span>
              </div>
            </div>
            <div
              className="specialty-card"
              value="Phẫu Thuật Thẩm Mỹ"
              onClick={(e) => {
                handleBookingBySpecialties("Phẫu Thuật Thẩm Mỹ");
              }}
            >
              <div className="specialty-image">
                <img src={phauthuatthammy} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Phẫu Thuật Thẩm Mỹ</span>
              </div>
            </div>
            <div
              className="specialty-card"
              value="Ngoại Thần Kinh"
              onClick={(e) => {
                handleBookingBySpecialties("Ngoại Thần Kinh");
              }}
            >
              <div className="specialty-image">
                <img src={ngoaithankinh} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Ngoại Thần Kinh</span>
              </div>
            </div>
            <div
              className="specialty-card"
              value="Y Học Thể Thao"
              onClick={(e) => {
                handleBookingBySpecialties("Y Học Thể Thao");
              }}
            >
              <div className="specialty-image">
                <img src={yhocthethao} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Y Học Thể Thao</span>
              </div>
            </div>
            <div
              className="specialty-card"
              value="Dinh Dưỡng"
              onClick={(e) => {
                handleBookingBySpecialties("Dinh Dưỡng");
              }}
            >
              <div className="specialty-image">
                <img src={dinhduong} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Dinh Dưỡng</span>
              </div>
            </div>
            <div
              className="specialty-card"
              value="Truyền Nhiễm"
              onClick={(e) => {
                handleBookingBySpecialties("Truyền Nhiễm");
              }}
            >
              {/* <div className="specialty-card"> */}
              <div className="specialty-image">
                <img src={truyennhiem} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Truyền Nhiễm</span>
              </div>
              {/* </div> */}
            </div>
            <div
              className="specialty-card"
              value="Xét Nghiệm"
              onClick={(e) => {
                handleBookingBySpecialties("Xét Nghiệm");
              }}
            >
              {/* <div className="specialty-card"> */}
              <div className="specialty-image">
                <img src={xetnghiem} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Xét Nghiệm</span>
              </div>
              {/* </div> */}
            </div>
            <div
              className="specialty-card"
              value="Hô Hấp"
              onClick={(e) => {
                handleBookingBySpecialties("Hô Hấp");
              }}
            >
              {/* <div className="specialty-card"> */}
              <div className="specialty-image">
                <img src={Hohap} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Hô Hấp</span>
              </div>
              {/* </div> */}
            </div>
            <div
              className="specialty-card"
              value="Tâm Thần"
              onClick={(e) => {
                handleBookingBySpecialties("Tâm Thần");
              }}
            >
              {/* <div className="specialty-card"> */}
              <div className="specialty-image">
                <img src={tamthan} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Tâm thần</span>
              </div>
              {/* </div> */}
            </div>
            {/* <div className="specialty-card"> */}
            {/* <div className="specialty-image">
              <img src={Hohap} />
            </div>
            <div className="specialty-info"></div>
            <div className="specialty-action">
              <span>Hô hấp</span>
            </div> */}
            {/* </div> */}
            <div
              className="specialty-card"
              value="Sản Phụ Khoa"
              onClick={(e) => {
                handleBookingBySpecialties("Sản Phụ Khoa");
              }}
            >
              {/* <div className="specialty-card"> */}
              <div className="specialty-image">
                <img src={sanphukhoa} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Sản Phụ Khoa</span>
              </div>
              {/* </div> */}
            </div>
            <div
              className="specialty-card"
              value="Tai - Mũi - Họng"
              onClick={(e) => {
                handleBookingBySpecialties("Tai - Mũi - Họng");
              }}
            >
              {" "}
              {/* <div className="specialty-card"> */}
              <div className="specialty-image">
                <img src={taimuihong} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Tai - Mũi - Họng</span>
              </div>
              {/* </div> */}
            </div>
            <div
              className="specialty-card"
              value="Nội Thần Kinh"
              onClick={(e) => {
                handleBookingBySpecialties("Nội Thần Kinh");
              }}
            >
              {/* <div className="specialty-card"> */}
              <div className="specialty-image">
                <img src={noithankinh} />
              </div>
              <div className="specialty-info"></div>
              <div className="specialty-action">
                <span>Nội Thần Kinh</span>
              </div>
              {/* </div> */}
            </div>
          </div>
          <div>
            <button className="view-more-button" onClick={handleViewMoreClick}>
              {" "}
              {isExpanded ? "Thu gọn" : "Xem thêm"}{" "}
            </button>
          </div>
        </div>

        <div className="information_doctor">
          <div className="action">
            <p className="booking_title">Đội ngũ chuyên gia</p>
          </div>

          <div className="information_doctor_container">
            <div className="doctor_list">
              {doctors.length > 0 ? (
                doctors.slice(0, 6).map((doctor, index) => (
                  <div key={index} className="doctor_card">
                    <img
                      src={`data:image/jpeg;base64,${doctor.imageUrl}`}
                      alt=""
                    />
                    <div className="doctor_info">
                      <p className="doctor_name">
                        Ths.Bs {doctor.first_name} {doctor.last_name}
                      </p>
                      <p className="specialty">{doctor.specialties}</p>
                    </div>
                  </div>
                ))
              ) : (
                <span>Không có đội ngũ chuyên gia</span>
              )}
            </div>

            <div className="doctor_description">
              <p>
                Hội đồng tham vấn y khoa cùng đội ngũ biên tập viên và bác sĩ,
                dược sĩ đảm bảo nội dung chúng tôi cung cấp chính xác về mặt y
                khoa và cập nhập những thông tin chính xác nhất
              </p>
              <button
                className="expert_button"
                onClick={() => {
                  navigate("/doctor-list");
                }}
              >
                Đội ngũ chuyên gia &gt;
              </button>
            </div>
          </div>
        </div>

        {/* tin y tế */}
        <div className="news_section">
          <h1 className="title">DANH MỤC THUỐC</h1>
          <p className="subtitle">Chính thống - Minh bạch - Trung lập</p>
          <div className="search_container">
            <div className="filter_buttons">
              <button>Thuốc</button>
              <button>Dược liệu</button>
              <button>Bệnh</button>
              <button>Cơ thể</button>
            </div>
            <div className="search_bar">
              <input
                type="text"
                placeholder="Nhập tên thuốc..."
                value={searchKeyword}
                onChange={handleSearchChange} // Xử lý khi người dùng nhập
                onKeyDown={handleKeyDown} // Xử lý khi nhấn Enter
              />
              <button className="search_icon" onClick={handleSearch}>
                <i className="fa fa-search"></i>
              </button>
            </div>
          </div>
          <div>
            {medicines.length > 0 ? (
              <ul className="product_grid">
                {medicines.map((medicine) => (
                  <div className="product_card" key={medicine._id}>
                    <img
                      src={medicine.medicalImage}
                      alt={medicine.name}
                      className="product_image"
                    />
                    <h3 className="product_name">{medicine.name}</h3>
                    <p className="product_description">
                      <strong>Mô tả:</strong>{" "}
                      {medicine.description.substring(0, 100)}
                      ...
                    </p>
                    <p className="product_price">
                      <strong>Giá:</strong> {formatPrice(medicine.price)}đ
                    </p>
                    <button
                      className="product_link"
                      onClick={() => handleViewDetails(medicine)}
                    >
                      Xem chi tiết
                    </button>
                    {/* <a
                      href={`/medicine/${medicine._id}`}
                      className="product_link"
                    >
                      Xem chi tiết
                    </a> */}
                  </div>
                ))}
              </ul>
            ) : (
              <p>Không tìm thấy thuốc nào.</p>
            )}
            <ReactPaginate
              previousLabel={"Lùi"}
              nextLabel={"Tiếp"}
              breakLabel={"..."}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination_homepage"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              activeClassName={"active"}
            />
          </div>
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            medicine={selectedMedicine}
          />
        </div>
        {/* kết thúc tin y tế */}

        <div className="data-security-section">
          <h1 className="title">GIẤY PHÉP CHỨNG NHẬN ĐẠT CHUẨN GPP</h1>
          <p className="subtitle">
            Đội ngũ chuyên gia chứng nhận phòng khám đạt chuẩn GPP
          </p>

          <div className="icons-container">
            <div className="icon-item">
              <img src={chungnhan1} alt="icon" />
              <p style={{ fontWeight: "700" }}>
                Hạ tầng đạt tiêu chuẩn
                <br />
                ISO 15189:2012
              </p>
            </div>
            <div className="icon-item">
              <img src={chungnhan2} alt="icon" />
              <p style={{ fontWeight: "700" }}>
                Thông tin sức khỏe được
                <br />
                đảm bảo tốt nhất
                <br />
                <a href="#">HIPAA</a>
              </p>
            </div>
            <div className="icon-item">
              <img src={chungnhan3} alt="icon" />
              <p style={{ fontWeight: "700" }}>
                Thành viên
                <br />
                VNISA
              </p>
            </div>
            <div className="icon-item">
              <img src={chungnhan4} alt="icon" />
              <p style={{ fontWeight: "700" }}>
                Pentest định kì
                <br />
                hằng năm
              </p>
            </div>
          </div>

          <p className="description">
            Với nhiều năm kinh nghiệm trong lĩnh vực Y tế, chúng tôi hiểu rằng,
            dữ liệu sức khỏe của bạn chỉ thuộc về bạn, và tuân thủ các chính
            sách bảo mật dữ liệu cao nhất trên thế giới.
          </p>
        </div>
      </div>
    </>
  );
};

export default HomePage;
