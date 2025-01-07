import React from "react";
import { NavLink } from "react-router-dom";
import "../../style/DoctorSidebar/DoctorSidebar.scss";

function DoctorSidebar() {
  return (
    <div className="doctor-sidebar">
      <h3>Doctor Dashboard</h3>
      <ul>
        <li>
          <NavLink
            to="/bac-si/ho-so"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Hồ sơ cá nhân
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/bac-si/ho-so-benh-nhan"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Hồ sơ bệnh nhân
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/bac-si/lich-hen"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Xem lịch hẹn khám
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/bac-si/log-out"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Đăng xuất
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default DoctorSidebar;
