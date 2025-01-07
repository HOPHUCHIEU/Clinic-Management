import axiosInstance from "../config/axios.customize";

export const getMedicines = async (page, limit) => {
  try {
    return await axiosInstance.get(
      `/api/medicines/all-medicines?page=${page}&limit=${limit}`
    );
  } catch (error) {
    console.error("Get medicines error:", error.response);
    return error.response
      ? error.response.data
      : { success: false, message: "Network error" };
  }
};

export const addNewMedicine = async (medicineData) => {
  try {
    return await axiosInstance.post(
      "/api/medicines/create-medicine",
      medicineData
    );
  } catch (error) {
    console.error("Add medicine error:", error.response);
    return error.response
      ? error.response.data
      : { success: false, message: "Network error" };
  }
};

export const deleteMedicine = async (id) => {
  try {
    return await axiosInstance.delete(`/api/medicines/delete-medicine/${id}`);
  } catch (error) {
    return error.response
      ? error.response.data
      : { success: false, message: "Network error" };
  }
};

export const updateMedicine = async (id, medicineData) => {
  try {
    return await axiosInstance.put(
      `/api/medicines/update-medicine/${id}`,
      medicineData
    );
  } catch (error) {
    return error.response
      ? error.response.data
      : { success: false, message: "Network error" };
  }
};
