import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../style/userProfile/profileSidebar.scss";
import Cookies from "js-cookie"; // Thêm thư viện để lấy thông tin cookie

const ProfileSidebar = () => {
  // Lấy vai trò người dùng từ cookies
  const userRole = Cookies.get("role");
  const navigate = useNavigate(); // Khởi tạo useNavigate để điều hướng

  const handleLogout = () => {
    // Xóa tất cả thông tin liên quan đến người dùng
    localStorage.clear();

    // Xóa cookies
    Cookies.remove("access_token", { path: "/" });
    Cookies.remove("role", { path: "/" });
    Cookies.remove("username", { path: "/" });
    Cookies.remove("id", { path: "/" });
  };

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {userRole === "doctor" ? (
            <>
              <li>
                <NavLink
                  to="/thong-tin/ho-so"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Hồ sơ cá nhân
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/thong-tin/ho-so-benh-nhan"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Hồ sơ bệnh nhân
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="bac-si/lich-hen"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Xem lịch hẹn khám
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/thong-tin/tai-khoan"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Tài khoản
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/thong-tin/lich-kham"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Lịch khám
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/thong-tin/ho-so"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Hồ sơ
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/thong-tin/tai-khoan"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Tài khoản
                </NavLink>
              </li>
            </>
          )}
          <li>
            <NavLink
              to="login-register"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={handleLogout}
            >
              <i className="fa fa-sign-out"></i> Đăng xuất
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
