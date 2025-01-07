import React, { useState } from "react";
import "../../style/LoginRegister/LoginRegister.scss";
import { LoginApi, ResgisterApi } from "../../utils/AuthAPI/LoginRegisterAPI";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie"; // Thư viện quản lý Cookies

function LoginRegister() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  // Xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      if (!email) {
        toast.error("Vui lòng nhập email.");
      }
      if (!password) {
        toast.error("Vui lòng nhập mật khẩu.");
      }
      return;
    }

    try {
      const res = await LoginApi(email, password);

      if (res && res.EC === 0) {
        if (res.role === "admin") {
          toast.error("Admin không được phép đăng nhập ở đây");
          return;
        }

        // Lưu thông tin vào cookies
        Cookies.set("access_token", res.token, {
          secure: false,
          sameSite: "Lax", // Hoặc Strict tùy theo tình huống
          expires: 1, // Thời gian hết hạn 7 ngày
          path: "/",
        });
        const usernameSafe = res.username.replace(/ /g, "_");
        Cookies.set("username", usernameSafe, {
          secure: false,
          sameSite: "Lax", // Hoặc Strict tùy theo tình huống
          expires: 1, // Thời gian hết hạn 7 ngày
          path: "/",
        });
        Cookies.set("role", res.role, {
          secure: false,
          sameSite: "Lax", // Hoặc Strict tùy theo tình huống
          expires: 1, // Thời gian hết hạn 7 ngày
          path: "/",
        });
        Cookies.set("id", res._id, {
          secure: false,
          sameSite: "Lax", // Hoặc Strict tùy theo tình huống
          expires: 1, // Thời gian hết hạn 7 ngày
          path: "/",
        });
        localStorage.setItem("username", res.username);

        // Hiển thị toast

        // Điều hướng ngay lập tức
        navigate(res.role === "doctor" ? "/thong-tin/ho-so" : "/");
        toast.success(res.EM || "Đăng nhập thành công!");
      } else {
        toast.error(res.EM || "Đăng nhập không thành công!");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Có lỗi xảy ra trong quá trình đăng nhập!"
      );
    }
  };

  // Xử lý đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phone ||
      !address ||
      !gender ||
      !birthdate
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // Kiểm tra định dạng email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Email không hợp lệ.");
      return;
    }

    // Kiểm tra định dạng số điện thoại (10-15 ký tự)
    const phonePattern = /^[0-9]{10,15}$/;
    if (!phonePattern.test(phone)) {
      toast.error("Số điện thoại không hợp lệ. Nó phải từ 10 đến 15 ký tự số.");
      return;
    }

    // Kiểm tra độ dài của mật khẩu
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    // Kiểm tra định dạng ngày sinh
    const birthdatePattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
    if (!birthdatePattern.test(birthdate)) {
      toast.error("Ngày sinh không hợp lệ. Định dạng phải là YYYY-MM-DD.");
      return;
    }

    try {
      const res = await ResgisterApi(
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        gender,
        birthdate
      );

      if (res && res.EC === 0) {
        toast.success(res.EM);
        setIsRegistering(false); // Đặt lại trạng thái về đăng nhập
      } else {
        toast.error(res.EM || "Đăng ký không thành công!");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Có lỗi xảy ra trong quá trình đăng ký!"
      );
    }
  };

  return (
    <>
      <div className="login">
        <div className="login__container">
          <div className="login__form-left">
            <h2>Welcome back</h2>
            <p>Chào mừng bạn đến với phòng khám của chúng tôi</p>
            <button className="login__button" onClick={toggleForm}>
              {isRegistering ? "Sign in" : "Sign up"}
            </button>
          </div>
          <div className="login__form-right">
            <h2>{isRegistering ? "Sign up" : "Sign in"}</h2>
            <div className="login__social-icons">
              {/* Biểu tượng đăng nhập mạng xã hội */}
            </div>
            {isRegistering ? (
              <form onSubmit={handleRegister}>
                <div className="login__input-group">
                  <input
                    type="text"
                    placeholder="Họ và tên đệm"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Tên"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="login__input-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="login__input-group">
                  <input
                    type="text"
                    placeholder="Địa chỉ"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="" disabled>
                      Giới tính
                    </option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div className="login__input-group">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <input
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                  />
                </div>
                <button type="submit" className="login__button sign-up-btn">
                  Sign up
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin}>
                <div className="login__input-group">
                  <input
                    type="email"
                    className="login_email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="login__input-group">
                  <input
                    type="password"
                    className="login_password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="login__button sign-in-btn ">
                  Sign in
                </button>
                <p className="login__forgot-password">
                  <a href="#">Forgot Password?</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
}

export default LoginRegister;
