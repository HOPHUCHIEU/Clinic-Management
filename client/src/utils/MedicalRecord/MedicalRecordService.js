import axios from "../../config/axios.customize";

// Tạo mới một hồ sơ bệnh án
const createMedicalRecord = (data) => {
    return axios.post(`/api/medicalRecord/create`, data);
};

// Thêm một lần khám mới vào lịch sử khám bệnh của bệnh nhân
const addVisitHistory = (patientId, visitData) => {
    return axios.post(`/api/medicalRecord/${patientId}/add-visit`, visitData);
};

// Lấy hồ sơ bệnh án theo ID bệnh nhân
const getMedicalRecordByPatientId = (patientId) => {
    return axios.get(`/api/medicalRecord/${patientId}`);
};

// Lấy tất cả hồ sơ bệnh án
const getAllMedicalRecords = (page, limit) => {
    return axios.get(`/api/medicalRecord/`);
};

export {
    createMedicalRecord,
    addVisitHistory,
    getMedicalRecordByPatientId,
    getAllMedicalRecords,
};
