const bcrypt = require("bcryptjs");
const User = require("../models/User");

const seedAdmin = async () => {
  const adminEmail = "admin@example.com";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new User({
      first_name: "Trong",
      last_name: "Thanh",
      email: adminEmail,
      phone: "0123456789",
      address: "03 Quang Trung Office",
      gender: "Male",
      password: hashedPassword,
      role: "admin",
      birthdate: "1990-01-01",
    });
    await admin.save();
    console.log("Tài khoản admin mặc định đã được tạo");
  } else {
    console.log("Admin đã tồn tại");
  }
};

module.exports = seedAdmin;
