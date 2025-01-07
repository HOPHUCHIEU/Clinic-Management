import React, { useEffect, useState } from "react";
import "../../style/adminStyle/medicine.scss";
import {
  getMedicines,
  addNewMedicine,
  deleteMedicine,
  updateMedicine,
} from "../../services/medicineAPI";
import ModalCreateMedicine from "../../components/admin/Medication/ModalCreateMedicine";
import ModalEditMedicine from "../../components/admin/Medication/ModalEditMedicine";
import ModalDeleteMedicine from "../../components/admin/Medication/ModalDeleteMedicine";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Medication() {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]); // Danh sách thuốc sau khi lọc
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm

  const [editingMedicine, setEditingMedicine] = useState(null);
  const [deletingMedicine, setDeletingMedicine] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const itemsPerPage = 10; // Số mục trên mỗi trang

  // Lấy danh sách thuốc từ server
  const fetchMedicines = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMedicines(1, 100); // Tải tất cả thuốc, không phân trang từ server
      if (data) {
        setMedicines(data.medicines);
        setFilteredMedicines(data.medicines); // Ban đầu không có bộ lọc
        setTotalPages(Math.ceil(data.medicines.length / itemsPerPage));
      } else {
        setError("Không thể tải danh sách thuốc.");
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setError("Lỗi khi kết nối tới server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = medicines.filter(
      (medicine) => medicine.name.toLowerCase().includes(term.toLowerCase()) // Lọc danh sách theo tên thuốc
    );
    setFilteredMedicines(filtered);
    setCurrentPage(1); // Reset về trang đầu tiên
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  // Phân trang
  const paginatedMedicines = filteredMedicines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="medicine-page">
      <div className="top-bar">
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          Thêm thuốc mới
        </button>
        <div className="search-bar-medicine">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Tìm kiếm thuốc..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

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
          <table className="medicine-table">
            <thead>
              <tr>
                <th>Tên thuốc</th>
                <th>Mô tả</th>
                <th>Đơn vị tính</th>
                <th>Đơn   Giá</th>
                <th>Số lượng</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMedicines.length > 0 ? (
                paginatedMedicines.map((medicine) => (
                  <tr key={medicine._id}>
                    <td>{medicine.name || "Không xác định"}</td>
                    <td>{medicine.description || "Không xác định"}</td>
                    <td>{medicine.unit_of_caculation || "Không rõ"}</td>
                    <td>
                      {medicine.price !== null && medicine.price !== undefined
                        ? medicine.price.toLocaleString() + " VND"
                        : "N/A"}
                    </td>
                    <td>{medicine.quantity_available || 0}</td>
                    <td>
                      <button
                        className="btn btn-edit"
                        onClick={() => {
                          setEditingMedicine(medicine);
                          setShowEditModal(true);
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => {
                          setDeletingMedicine(medicine);
                          setShowDeleteModal(true);
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Không có thuốc nào phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

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

      {/* Modal thêm thuốc */}
      <ModalCreateMedicine
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        fetchMedicines={fetchMedicines}
        addNewMedicine={addNewMedicine}
      />

      {/* Modal chỉnh sửa thuốc */}
      {editingMedicine && (
        <ModalEditMedicine
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          fetchMedicines={fetchMedicines}
          editingMedicine={editingMedicine}
          updateMedicine={updateMedicine}
        />
      )}

      {/* Modal xóa thuốc */}
      {deletingMedicine && (
        <ModalDeleteMedicine
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          fetchMedicines={fetchMedicines}
          deletingMedicine={deletingMedicine}
          deleteMedicine={deleteMedicine}
        />
      )}
    </div>
  );
}

export default Medication;
