import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import "../../style/header.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Header = () => {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = Cookies.get("access_token");
    const storedUsername = Cookies.get("username");
    const storedRole = Cookies.get("role");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUsername) {
      setUsername(storedUsername.replace(/_/g, " "));
    } else {
      setUsername("");
    }
    if (storedRole) {
      setRole(storedRole); // Lưu role vào state
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setToken("");
    setUsername("");
    Cookies.remove("access_token");
    Cookies.remove("role");
    Cookies.remove("username");
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login-register");
  };
  const handleSignup = () => {
    navigate("/login-register");
  };

  return (
    <Navbar expand="lg" className="navbar-custom bg-body-tertiary">
      <Container>
        <Navbar.Brand href={role === "doctor" ? null : "/"}>
          <h1 className="logoMain">
            Caps<span>tone1</span>
          </h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav-links">
            {role !== "doctor" && (
              <Nav.Link href="/dat-kham/bac-si/tim-kiem">
                Đặt lịch khám
              </Nav.Link>
            )}
            <Nav.Link href="/gioi-thieu">Giới thiệu</Nav.Link>
            <Nav.Link href="/tin-tuc/">Tin y tế</Nav.Link>
            <Nav.Link href="/dich-vu-kham">Dịch vụ khám</Nav.Link>
          </Nav>
          <div className="navbar-buttons">
            {username ? (
              <div className="user_info">
                <NavDropdown title={username} id="basic-nav-dropdown">
                  {role === "doctor" ? (
                    <>
                      <NavDropdown.Item href="/thong-tin/ho-so">
                        Hồ sơ cá nhân
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/bac-si/lich-hen">
                        Xem Lịch hẹn khám
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/thong-tin/ho-so-benh-nhan">
                        Hồ sơ bệnh nhân
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/thong-tin/tai-khoan">
                        Tài Khoản
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={handleLogout}>
                        Đăng xuất
                      </NavDropdown.Item>
                    </>
                  ) : role === "patient" ? (
                    <>
                      <NavDropdown.Item href="/thong-tin/ho-so">
                        Hồ sơ bệnh nhân
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/thong-tin/lich-kham">
                        Lịch khám
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/thong-tin/tai-khoan">
                        Tài Khoản
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={handleLogout}>
                        Đăng xuất
                      </NavDropdown.Item>
                    </>
                  ) : (
                    handleLogout()
                  )}
                </NavDropdown>
              </div>
            ) : (
              <div className="login-dropdown-container">
                <Button className="btn_signup" onClick={handleSignup}>
                  Đăng ký
                </Button>
                <Button className="btn_login" onClick={handleLogin}>
                  Đăng nhập
                </Button>
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
