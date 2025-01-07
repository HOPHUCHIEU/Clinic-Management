import React from "react";
import { NavLink } from "react-router-dom";
import "../../style/layoutAdmin/admin.scss";
import Cookies from "js-cookie"; // Thư viện quản lý Cookies
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();

    // Cần chắc chắn rằng domain và path giống với lúc set cookie
    Cookies.remove("access_token", {
      path: "/",
      domain: "localhost",
      sameSite: "Strict",
      secure: true,
    });
    Cookies.remove("role", {
      path: "/",
      domain: "localhost",
      sameSite: "Strict",
      secure: true,
    });
    Cookies.remove("username", {
      path: "/",
      domain: "localhost",
      sameSite: "Strict",
      secure: true,
    });

    // Kiểm tra xem cookie có bị xóa không trước khi điều hướng
    if (!Cookies.get("access_token")) {
      navigate("/admin/login");
    }
  };

  return (
    <div className="admin-sidebar">
      <ul>
        <li>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa fa-dashboard"></i> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/bac-si"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa fa-user-md"></i> Quản lý bác sĩ
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/benh-nhan"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa fa-user"></i> Quản lý bệnh nhân
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/thuoc"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa fa-medkit"></i> Quản lý thuốc
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/dich-vu-kham"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa fa-hospital"></i> Quản lý dịch vụ khám
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/lich-lam-viec"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa fa-calendar"></i> Quản lý lịch làm việc
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/blog"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa fa-book"></i> Quản lý blog
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/logout"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="fa fa-sign-out" onClick={() => handleLogout}></i> Sign
            Out
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
