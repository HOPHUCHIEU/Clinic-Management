import axios from "../../config/axios.customize";

export const  editUser = async (userID, formData) => {
    return axios.put(`/api/user/edit-users/${userID}`, formData)
}
export const getUserById = async (userID, role) => {
    return axios.get(`/api/user/users/${userID}?role=${role}`)
}
// Cập nhật hàm changePassword
export const changePassword = async (currentPassword, newPassword) => {
    return axios.put('/api/auth/change-password', { currentPassword, newPassword});
}