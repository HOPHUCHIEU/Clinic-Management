import React, { useState, useEffect } from "react";
import {
  getAllUserByRole,
  createDoctor,
  countUserByRole,
} from "../../utils/AuthAPI/AdminService";
import "../../style/adminStyle/doctors.scss";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import ModalDeleteDoctor from "../../components/admin/Doctor/ModalDeleteDoctor";
import ModalEditDoctor from "../../components/admin/Doctor/ModalUpdateDoctor";
import ModalCreateDoctor from "../../components/admin/Doctor/ModalCreateDoctor";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]); // Danh sách bác sĩ sau khi lọc
  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [totalUser, setTotalUser] = useState(0);

  const fetchDoctors = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUserByRole("doctor", page, 10);
      const totalUser = await countUserByRole("doctor");

      if (data) {
        setTotalUser(totalUser.userCount);
        setDoctors(data.users);
        setFilteredDoctors(data.users); // Cập nhật danh sách lọc ban đầu
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } else {
        setError("Không thể tải danh sách bác sĩ.");
      }
    } catch (error) {
      console.error("Error fetching users by role:", error);
      setError("Lỗi khi kết nối tới server.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors(currentPage);
  }, [currentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);

    // Lọc danh sách bác sĩ
    const filtered = doctors.filter(
      (doctor) =>
        doctor.first_name.toLowerCase().includes(query.toLowerCase()) ||
        doctor.last_name.toLowerCase().includes(query.toLowerCase()) ||
        doctor.email.toLowerCase().includes(query.toLowerCase()) ||
        doctor.phone.includes(query)
    );

    setFilteredDoctors(filtered);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <div className="doctor-page">
        <div className="header-section">
          <div className="add-doctor-button">
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              Thêm Bác Sĩ Mới
            </button>
            <div className="total-doctor">
              <span>Tổng số bác sĩ: {totalUser}</span>
            </div>
          </div>
          {/* Ô tìm kiếm */}
          <div className="search-bar-doctor">
            <input
              type="text"
              placeholder="Tìm kiếm bác sĩ..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Hiển thị danh sách bác sĩ */}
        <div className="table-container">
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table className="doctor-table">
              <thead>
                <tr>
                  <th>Tên bác sĩ</th>
                  <th>Email</th>
                  <th>Giới tính</th>
                  <th>Số điện thoại</th>
                  <th>Chuyên khoa</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor, index) => (
                    <tr key={index}>
                      <td>
                        {doctor.first_name} {doctor.last_name}
                      </td>
                      <td>{doctor.email}</td>
                      <td>{doctor.gender}</td>
                      <td>{doctor.phone}</td>
                      <td>{doctor.specialties}</td>
                      <td>
                        <button
                          className="btn btn-edit"
                          onClick={() => {
                            setShowEditModal(true);
                            setSelectedUser(doctor);
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => {
                            setShowDeleteModal(true);
                            setSelectedUser(doctor);
                          }}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">Không tìm thấy bác sĩ phù hợp.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          <ToastContainer />
        </div>

        {/* Nút phân trang */}
        <div className="pagination">
          <button
            className="btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Lùi
          </button>
          <span>
            Trang {currentPage} của {totalPages}
          </span>
          <button
            className="btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Tiếp
          </button>
        </div>

        {/* Modal tạo, sửa, xóa bác sĩ */}
        <ModalCreateDoctor
          show={showCreateModal}
          handleClose={() => setShowCreateModal(false)}
          fetchDoctors={fetchDoctors}
          createDoctor={createDoctor}
        />
        <ModalDeleteDoctor
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          selectedUser={selectedUser}
          doctors={doctors}
          fetchDoctors={fetchDoctors}
        />
        <ModalEditDoctor
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          selectedUser={selectedUser}
          doctors={doctors}
          fetchDoctors={fetchDoctors}
        />
      </div>
    </>
  );
};

export default Doctors;
