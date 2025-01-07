const userService = require("../service/userService");

// Đăng nhập cho tất cả loại người dùng
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { _id, token, role, username } = await userService.login(
      email,
      password
    );

    res.status(200).json({
      EC: 0,
      EM: "Đăng nhập thành công",
      user: { email, password },
      token,
      role,
      _id,
      username,
    });
  } catch (error) {
    res.status(400).json({
      EC: 1,
      EM: "Đăng nhập không thành công",
      message: error.message,
    });
  }
};

// Đăng ký cho benh nhan
exports.register = async (req, res) => {
  try {
    const newUser = await userService.register(req.body);
    res
      .status(201)
      .json({ EC: 0, EM: "Đăng ký tài khoản thành công", user: newUser });
  } catch (err) {
    res.status(400).json({ EC: 1, EM: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Call the service function to change the password
    const result = await userService.changePassword(
      req.user._id,
      currentPassword,
      newPassword
    );

    // Check if the operation was successful
    if (result.EC === 0) {
      return res.status(200).json({ message: result.EM });
    } else {
      return res.status(400).json({ message: result.EM });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi. Vui lòng thử lại." });
  }
};
