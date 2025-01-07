import axios from "axios";

// Tạo một instance của axios với baseURL từ biến môi trường
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Hàm lấy giá trị của cookie từ tên
const getCookie = (name) => {
  const value = `; ${document.cookie}`; // Lấy tất cả cookie và thêm dấu ";" ở đầu để dễ phân tách
  const parts = value.split(`; ${name}=`); // Phân tách chuỗi cookie theo tên cookie cần tìm
  if (parts.length === 2) {
    // Nếu tìm thấy cookie có tên trùng khớp
    return parts.pop().split(";").shift(); // Trả về giá trị của cookie
  }
  return null; // Trả về null nếu không tìm thấy cookie
};

// Thêm một request interceptor để gắn token vào mỗi yêu cầu
instance.interceptors.request.use(
  function (config) {
    // Lấy token từ cookie thay vì localStorage
    const token = getCookie("access_token"); // "access_token" là tên của cookie chứa token

    if (token) {
      // Nếu token tồn tại, thêm nó vào headers dưới dạng Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // Trả về cấu hình yêu cầu với token đã được đính kèm
  },
  function (error) {
    // Xử lý lỗi xảy ra trước khi yêu cầu được gửi đi
    return Promise.reject(error); // Trả về lỗi để xử lý sau
  }
);

// Thêm một response interceptor để xử lý phản hồi
instance.interceptors.response.use(
  function (response) {
    // Nếu phản hồi thành công (status code 2xx)
    if (response && response.data) {
      // Nếu có dữ liệu trong phản hồi, trả về dữ liệu đó
      return response.data;
    }

    return response; // Nếu không có dữ liệu cụ thể, trả về toàn bộ phản hồi
  },
  function (error) {
    // Xử lý các lỗi xảy ra trong quá trình nhận phản hồi (ví dụ: status code ngoài 2xx)
    return Promise.reject(error); // Trả về lỗi để xử lý tiếp
  }
);

export default instance; // Xuất instance của axios để sử dụng trong các file khác
