import axios from "../../config/axios.customize";

export const getAppointmentCountBySpecialties =()=>{
    return axios.get("/api/statics/count-by-specialties")
 
}
export const getTodayAppointmentCount=()=>{
    return axios.get("/api/statics/today/count")
 
}
export const getMonthlyAppointmentCountByDoctor=()=>{
    return axios.get("/api/statics/monthly-appointments")
}
export const getAverageConsultationTimeByDoctor=()=>{
    return axios.get("/api/statics/average-consultation-time")
}
export const getDailyAppointmentCountByDoctor =()=>{ 
    return axios.get("/api/statics/daily-appointments")
}