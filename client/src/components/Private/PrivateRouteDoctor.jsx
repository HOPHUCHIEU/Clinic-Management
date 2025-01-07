import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

// eslint-disable-next-line react/prop-types
const PrivateRouteDoctor = ({ allowedRoles }) => {
  const token = Cookies.get("access_token");
  const role = Cookies.get("role");

  // Kiểm tra token và role
  

  // Điều hướng từ trang chính đến hồ sơ nếu là bác sĩ
  useEffect(() => {
      // eslint-disable-next-line react/prop-types
    if (!token || !allowedRoles.includes(role)) {
      return <Navigate to="/login-register" />;
    }
    const currentPath = window.location.pathname;
    if (role === "doctor" && currentPath === "/") {
      // Chuyển hướng đến trang hồ sơ bác sĩ
      window.location.replace("/thong-tin/ho-so");
    }
  }, [role]);

  return <Outlet />;
};

export default PrivateRouteDoctor;
