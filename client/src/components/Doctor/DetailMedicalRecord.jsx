import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Accordion, Card } from 'react-bootstrap';
import { getMedicalRecordByPatientId } from '../../utils/MedicalRecord/MedicalRecordService'; // Adjust the import as needed
import './DetailMedicalRecord.scss';

const DetailMedicalRecord = ({ show, onClose, selectedRecord }) => {
  const [loading, setLoading] = useState(true);
  const [medicalRecord, setMedicalRecord] = useState(null);

  useEffect(() => {
    const fetchMedicalRecord = async (patientId) => {
      try {
        const response = await getMedicalRecordByPatientId(patientId);
        if (response && response.success) {
          setMedicalRecord(response.medicalRecord);
        } else {
          console.error('Invalid response structure:', response);
        }
      } catch (error) {
        console.error('Error fetching medical record:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedRecord && selectedRecord.patient_id) {
      fetchMedicalRecord(selectedRecord.patient_id);
    } else {
      setLoading(false);
    }
  }, [selectedRecord]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!medicalRecord) {
    return <div>No medical record found</div>;
  }

  const { patient_id, medical_history = [] } = medicalRecord;

  if (!patient_id || !patient_id.first_name || !patient_id.last_name) {
    return <div>Invalid patient information</div>;
  }

  const { first_name, last_name, birthdate, gender, address } = patient_id;

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết hồ sơ bệnh án</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="patient-info">
          <h3>Thông tin Bệnh nhân</h3>
          <p>
            <strong>Họ và tên:</strong> {first_name} {last_name}
          </p>
          <p>
            <strong>Ngày sinh:</strong> {birthdate || 'Chưa có thông tin'}
          </p>
          <p>
          <strong>Giới tính:</strong> {gender ? (gender === "Male" ? "Nam" : "Nữ") : "Chưa có thông tin"}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {address || 'Chưa có thông tin'}
          </p>
        </div>
        <p className="history-medical">Lịch sử khám</p>
        <Accordion>
          {medical_history.length > 0 ? (
            medical_history.map((visit, index) => {
              const {
                visit_date,
                symptoms = [],
                diagnosis,
                treatment_plan,
                notes = [],
                prescriptions = [],
                total_price,
                doctor_id,
              } = visit;

              return (
                <Accordion.Item eventKey={index.toString()} key={index}>
                  <Accordion.Header>
                    Ngày: {new Date(visit_date).toLocaleDateString()}
                  </Accordion.Header>
                  <Accordion.Body>
                    <h5>Thông tin Bác sĩ</h5>
                    <p>
                      <strong>Họ và tên:</strong> {doctor_id?.first_name} {doctor_id?.last_name}
                    </p>
                    <p>
                      <strong>Email:</strong> {doctor_id?.email}
                    </p>
                    <p>
                      <strong>Điện thoại:</strong> {doctor_id?.phone}
                    </p>
                    <p>
                      <strong>Triệu chứng:</strong> {symptoms.join(', ')}
                    </p>
                    <p>
                      <strong>Chẩn đoán:</strong> {diagnosis}
                    </p>
                    <p>
                      <strong>Kế hoạch điều trị:</strong> {treatment_plan}
                    </p>
                    <p>
                      <strong>Ghi chú:</strong> {notes.join(', ')}
                    </p>
                    <p>
                      <strong>Đơn thuốc:</strong>
                      {prescriptions.map((prescription, pIndex) => (
                        <div key={pIndex}>
                          {prescription.medications.map((med, mIndex) => (
                            <div key={mIndex}>
                              {med.medication_id
                                ? `Tên: ${med.medication_id.name} - Số lượng: ${med.quantity} - Liều dùng: ${med.dosage} - Giá: ${med.price} VND`
                                : 'Unknown medication'}
                            </div>
                          ))}
                        </div>
                      ))}
                    </p>
                    <p>
                      <strong>Tổng tiền:</strong> {total_price} VND
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })
          ) : (
            <div>Không có lịch sử khám</div>
          )}
        </Accordion>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DetailMedicalRecord.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedRecord: PropTypes.object.isRequired,
};

export default DetailMedicalRecord;
