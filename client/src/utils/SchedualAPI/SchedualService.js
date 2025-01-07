import axios from "../../config/axios.customize";
const getScheduleDoctorById = (doctorID) => {
  return axios.get(`/api/schedule/get-schedual/${doctorID}`);
};
const getScheduleDoctorByDate = (date) => {
  return axios.get(`/api/schedule/doctor-schedule?date=${date}`);
};
const deleteDoctorSchedules = (schedualId) => {
  return axios.delete(`/api/schedule/delete-schedule/${schedualId}`);
};
const editDoctorSchedules=(id,data)=>{
  return axios.put(`/api/schedule/update-schedules/${id}`,data);
}
const createDoctorSchedule = (data)=>{
  return axios.post(`/api/schedule/create-schedual`,data);

}
export {
  getScheduleDoctorById,
  getScheduleDoctorByDate,
  deleteDoctorSchedules,
  editDoctorSchedules,
  createDoctorSchedule
};
