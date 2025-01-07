import axiosInstance from "../config/axios.customize";

export const loginAdmin = async (email, password) => {
  try {
    const res = await axiosInstance.post("/api/auth/login", {
      email,
      password,
    });
    console.log("Login response:", res);
    return res; // Return the actual response data
  } catch (error) {
    console.error("Login error:", error.response);
    return error.response
      ? error.response.data
      : { EC: -1, EM: "Network error" };
  }
};
