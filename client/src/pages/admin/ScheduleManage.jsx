import React, { useState, useEffect } from "react";
import { Button, Table, FormControl, InputGroup } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../style/adminStyle/ScheduleManage.scss";
import ReactPaginate from "react-paginate";

import {
  getScheduleDoctorByDate,
  deleteDoctorSchedules,
  editDoctorSchedules,
  createDoctorSchedule,
} from "../../utils/SchedualAPI/SchedualService";
import ModalDeleteSchedule from "../../components/admin/Schedule/ModalDeleteSchedule";
import ModalUpdateSchedule from "../../components/admin/Schedule/ModalUpdateSchedule";
import ModalCreateSchedule from "../../components/admin/Schedule/ModalCreateSchedule";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiCirclePlus } from "react-icons/ci";

const ScheduleManage = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [noSchedulesMessage, setNoSchedulesMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Lọc lịch khám theo từ khóa tìm kiếm
  const filteredSchedules = schedules.filter((schedule) =>
    schedule.doctor_name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const paginatedSchedules = filteredSchedules.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const fetchSchedules = async (date) => {
    setLoading(true);
    setNoSchedulesMessage(false);

    try {
      const response = await getScheduleDoctorByDate(date);
      if (response.success) {
        setSchedules(response.data);
        setNoSchedulesMessage(response.data.length === 0);
      } else {
        setSchedules([]);
        setNoSchedulesMessage(true);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setNoSchedulesMessage(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    const newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setSelectedDate(newDate);
    const formattedDate = newDate.toISOString().split("T")[0];
    fetchSchedules(formattedDate);
  };

  const handleFetchDataClick = () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    fetchSchedules(formattedDate);
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
    setCurrentPage(0);
  };

  const handleOpenDeleteModal = (schedule) => {
    setSelectedSchedule(schedule);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedSchedule(null);
  };

  const handleOpenEditModal = (schedule) => {
    setSelectedSchedule(schedule);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedSchedule(null);
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleDeleteSchedule = async () => {
    if (selectedSchedule) {
      try {
        const response = await deleteDoctorSchedules(
          selectedSchedule.schedule_id
        );
        if (response.success) {
          toast.success("Xóa lịch khám thành công!");
          setSchedules((prevSchedules) =>
            prevSchedules.filter(
              (schedule) =>
                schedule.schedule_id !== selectedSchedule.schedule_id
            )
          );
          handleCloseDeleteModal();
        } else {
          toast.error("Xóa lịch thất bại!");
        }
      } catch (error) {
        console.error("Error deleting schedule:", error);
        toast.error("Có lỗi xảy ra khi xóa lịch");
      }
    }
  };

  const handleUpdateSchedule = async (updatedSchedule) => {
    try {
      const response = await editDoctorSchedules(
        updatedSchedule._id,
        updatedSchedule
      );
      if (response.success) {
        toast.success("Cập nhật lịch khám thành công!");
        fetchSchedules(selectedDate.toISOString().split("T")[0]);
        setShowEditModal(false);
        setSelectedSchedule(null);
      } else {
        toast.error("Cập nhật lịch thất bại!");
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Có lỗi xảy ra khi cập nhật lịch.");
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  useEffect(() => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    fetchSchedules(formattedDate);
  }, [selectedDate]);

  return (
    <div>
      {/* Thanh chọn ngày và nút thêm lịch */}
      <div className="datepiker-addbtn">
        <div className="date-picker-container">
          <label>Chọn Ngày:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd-MM-yyyy"
            className="form-control"
          />
          <Button variant="primary" onClick={handleFetchDataClick}>
            Lấy Dữ Liệu
          </Button>
        </div>
        <Button variant="primary" onClick={handleOpenCreateModal}>
          <CiCirclePlus className="ic" />
          Thêm lịch
        </Button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="search-bar-container" style={{ marginTop: "20px" }}>
        <InputGroup>
          <FormControl
            placeholder="Tìm kiếm theo tên bác sĩ..."
            value={searchKeyword}
            onChange={handleSearchChange}
          />
        </InputGroup>
      </div>

      {/* Bảng dữ liệu */}
      <Table striped bordered hover style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Bác sĩ</th>
            <th>Chuyên Khoa</th>
            <th>Ngày</th>
            <th>Giờ Bắt Đầu</th>
            <th>Giờ Kết Thúc</th>
            <th>Thời Gian Mỗi Slot</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7">Đang tải dữ liệu...</td>
            </tr>
          ) : paginatedSchedules.length > 0 ? (
            paginatedSchedules.map((schedule) => (
              <tr key={schedule.schedule_id}>
                <td>{schedule.doctor_name}</td>
                <td>{schedule.specialties.join(", ")}</td>
                <td>{new Date(schedule.date).toLocaleDateString("vi-VN")}</td>
                <td>{schedule.start_time}</td>
                <td>{schedule.end_time}</td>
                <td>{schedule.slot_duration} phút</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleOpenEditModal(schedule)}
                  >
                    Cập Nhật
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleOpenDeleteModal(schedule)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))
          ) : noSchedulesMessage ? (
            <tr>
              <td colSpan="7">Không có lịch khám nào cho ngày đã chọn.</td>
            </tr>
          ) : (
            <tr>
              <td colSpan="7">Không tìm thấy kết quả phù hợp.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Phân trang */}
      <ReactPaginate
        previousLabel={"Lùi"}
        nextLabel={"Tiếp"}
        pageCount={Math.ceil(filteredSchedules.length / itemsPerPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination_schedule"}
        activeClassName={"active"}
        forcePage={currentPage}
      />

      {/* Modals */}
      <ModalDeleteSchedule
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDeleteSchedule}
      />
      <ModalUpdateSchedule
        show={showEditModal}
        handleClose={handleCloseEditModal}
        handleUpdate={handleUpdateSchedule}
        selectedSchedule={selectedSchedule}
      />
      <ModalCreateSchedule
        show={showCreateModal}
        handleClose={handleCloseCreateModal}
      />
    </div>
  );
};

export default ScheduleManage;
