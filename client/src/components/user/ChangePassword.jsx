import React, { useState } from "react";
import "../../style/userProfile/profileSidebar.scss";
import "../../style/userProfile/ChangePassword.scss";
import { toast
  
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons
import { changePassword } from "../../utils/AuthAPI/userService";
import Cookies from "js-cookie"

const ChangePassword = () => {
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const toggleCurrentPasswordVisibility = () => {
    setCurrentPasswordVisible(!currentPasswordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

const handleChangePassword = async (e) => {
  e.preventDefault();

  if (!newPassword || !currentPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
  }

  try {
      const res = await changePassword(currentPassword, newPassword,); // Gọi hàm API
          toast.success("Mật khẩu đã được thay đổi thành công!");
          setCurrentPassword("");
          setNewPassword("");

  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);  // Hiển thị lỗi cụ thể từ backend
    } else {
      toast.error("Đã có lỗi xảy ra khi thay đổi mật khẩu");
    }
  }
};
  return (
    <div className="change-password-container">
      <h2>Thay đổi mật khẩu</h2>
      <form onSubmit={handleChangePassword}>
        <div className="form-group">
          <label>Mật khẩu hiện tại</label>
          <div className="password-input-container">
            <input
              type={currentPasswordVisible ? "text" : "password"}
              placeholder="Mật khẩu hiện tại"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <span
              className="toggle-password-icon"
              onClick={toggleCurrentPasswordVisibility}
            >
              {currentPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label>Mật khẩu mới</label>
          <div className="password-input-container">
            <input
              type={newPasswordVisible ? "text" : "password"}
              placeholder="Nhập mật khẩu mới"
              value={newPassword} // Liên kết giá trị với state
              onChange={(e) => setNewPassword(e.target.value)} // Cập nhật state
            />
            <span
              className="toggle-password-icon"
              onClick={toggleNewPasswordVisibility}
            >
              {newPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Thay đổi
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
