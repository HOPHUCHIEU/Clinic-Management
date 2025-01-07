import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie"; // Thư viện quản lý Cookies

// eslint-disable-next-line react/prop-types
const PrivateRouteAdmin = ({ allowedRoles = ["admin"] }) => {
  const token = Cookies.get("access_token"); // Lấy token từ Cookies
  const role = Cookies.get("role"); // Lấy role từ Cookies

  useEffect(() => {
    // Here you could verify the token with the backend (optional) or check expiration
    // For example, you could decode the JWT token and check its expiration time
  }, [token]);

  // Kiểm tra xem token và vai trò có hợp lệ hay không
  if (!token || !allowedRoles.includes(role)) {
    // Nếu không hợp lệ, điều hướng về trang đăng nhập
    return <Navigate to="/admin/login" />;
  }

  // Nếu hợp lệ, render các thành phần con
  return <Outlet />;
};

export default PrivateRouteAdmin;
