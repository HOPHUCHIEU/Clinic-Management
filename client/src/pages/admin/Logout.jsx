import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const Logout = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  useEffect(() => {
    Cookies.remove("access_token");
    Cookies.remove("role");
    Cookies.remove("username");

    navigate("/admin/login");
  }, [navigate]);

  return (
    <div>
      <h2>Đang đăng xuất...</h2>{" "}
    </div>
  );
};

export default Logout;
