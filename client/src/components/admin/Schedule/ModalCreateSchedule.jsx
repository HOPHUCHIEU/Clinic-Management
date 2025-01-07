import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Table, Spinner } from "react-bootstrap";
import { getAllUserByRole } from "../../../utils/AuthAPI/AdminService";
import ModalCreateScheduleByDoctor from "./ModalCreateScheduleByDoctor";

const ModalCreateSchedule = ({ show, handleClose, onScheduleCreated }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [showScheduleByDoctorModal, setShowScheduleByDoctorModal] = useState(
    false
  );
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const fetchDoctor = async () => {
    setLoading(true); // Set loading to true
    const data = await getAllUserByRole("doctor", 1, 100);
    if (data.success) {
      setDoctors(data.users); // Assuming data.users contains the list of doctors
    }
    setLoading(false); // Set loading to false after fetching data
  };

  useEffect(() => {
    fetchDoctor();
  }, []);

  const handleCreateSchedule = (doctor) => {
    setSelectedDoctor(doctor);
    handleClose(); // Hide ModalCreateSchedule
    setShowScheduleByDoctorModal(true); // Show ModalCreateScheduleByDoctor
  };

  const handleCloseScheduleByDoctorModal = () => {
    setShowScheduleByDoctorModal(false);
    setSelectedDoctor(null); // Reset the selected doctor
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tạo Lịch Làm Việc</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h5 className="mb-4">Danh Sách Bác Sĩ</h5>
          {loading ? (
            // Show spinner while loading
            <div className="d-flex justify-content-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-primary">
                <tr>
                  <th>Họ</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Điện Thoại</th>
                  <th>Chuyên Khoa</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <tr key={doctor._id}>
                      <td>{doctor.first_name}</td>
                      <td>{doctor.last_name}</td>
                      <td>{doctor.email}</td>
                      <td>{doctor.phone}</td>
                      <td>{doctor.specialties.join(", ")}</td>
                      <td>
                        <Button
                          variant="success"
                          onClick={() => handleCreateSchedule(doctor)}
                          size="sm"
                        >
                          Tạo lịch
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Không có bác sĩ nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
          <div></div>
          <div className="d-flex justify-content-end">
            <Button variant="primary" onClick={handleClose}>
              Đóng
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Conditionally render the ModalCreateScheduleByDoctor */}
      <ModalCreateScheduleByDoctor
        show={showScheduleByDoctorModal}
        handleClose={handleCloseScheduleByDoctorModal}
        doctor={selectedDoctor} // Pass the selected doctor to the next modal
        onScheduleCreated={onScheduleCreated} // Pass the callback
      />
    </>
  );
};

ModalCreateSchedule.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onScheduleCreated: PropTypes.func.isRequired, // Add prop type for the callback
};

export default ModalCreateSchedule;
