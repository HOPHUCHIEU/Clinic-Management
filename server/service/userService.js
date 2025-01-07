const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.register = async (userData) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    address,
    gender,
    password,
    birthdate,
    role,
  } = userData;

  // Chỉ cho phép đăng ký với role là "patient"
  if (role && role !== "patient") {
    throw new Error("Chỉ bệnh nhân mới có thể đăng ký tài khoản");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email đã tồn tại trong hệ thống");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    first_name,
    last_name,
    email,
    phone,
    address,
    gender,
    password: hashedPassword,
    birthdate,
    role: "patient",
  });

  await newUser.save();

  return newUser;
};

// Đăng nhập cho tất cả người dùng
exports.login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Tài khoản không tồn tại");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Mật khẩu không chính xác");
    }

    // Tạo username từ first_name và last_name
    const username = `${user.first_name} ${user.last_name}`;

    const token = jwt.sign(
      { _id: user._id, role: user.role, username: username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, role: user.role, _id: user._id, username }; // Trả về username
  } catch (error) {
    throw new Error(error.message);
  }
};

// changePassword
exports.changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return { EC: 1, EM: "Người dùng không tồn tại" };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { EC: 2, EM: "Mật khẩu hiện tại không chính xác" };
    }

    if (newPassword.length < 6) {
      return { EC: 3, EM: "Mật khẩu mới phải có ít nhất 6 ký tự" };
    }
    if (currentPassword === newPassword) {
      return { EC: 4, EM: "Mật khẩu mới không được trùng với mật khẩu cũ" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return { EC: 0, EM: "Đổi mật khẩu thành công" };
  } catch (error) {
    return { EC: -1, EM: "Đã xảy ra lỗi. Vui lòng thử lại." };
  }
};
