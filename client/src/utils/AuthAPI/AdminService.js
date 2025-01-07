// src/utils/AuthAPI/AdminService.js

import axios from "../../config/axios.customize";

// Ví dụ về hàm lấy danh sách người dùng theo vai trò
export const getAllUserByRole = async (role, page, limit) => {
    return axios.get(`/api/admin/users?role=${role}&page=${page}&limit=${limit}`);
};
export const createDoctor = async (doctorData) => {
  return axios.post('/api/admin/create-doctor', doctorData);
};
export const deletedUser = async (userID) => {
  return axios.delete(`/api/admin/delete-users/${userID}`);
};
export const editUser = async (userID, formData) => {
  return axios.put(`/api/admin/edit-users/${userID}`, formData); // Thêm formData vào request body
};
export const createPatient = (patientData) => {
  return axios.post('/api/admin/create-patient', patientData);

}
export const getAllDoctorsBySpecialty = async (specialties) => {
  return axios.post('api/admin/doctor-specialties', specialties);
}
export const getUserById = async (userID,role) => {
  return axios.get(`/api/admin/users/${userID}?role=${role}`);
 
}
export const countUserByRole = async (role) => {
  return axios.get(`/api/admin/count-userbyRole?role=${role}`);
}
export const getDoctorsBySearch = async (search, page, limit) => {
  return axios.get(`/api/admin/search-doctor?search=${search}&page=${page}&limit=${limit}`);
};
