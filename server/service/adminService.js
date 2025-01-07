const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Tạo tài khoản bac si
// src/service/adminService.js
// Tạo tài khoản bác sĩ
exports.createDoctor = async (doctorData) => {
  const { email, password, imageUrl, title, description, certifications, phone, ...restData } = doctorData;

  // Check for required fields
  if (!password) {
    return { success: false, message: "Mật khẩu không được để trống" };
  }

  if (!email) {
    return { success: false, message: "Email không được để trống" };
  }

  if (!phone) {
    return { success: false, message: "Số điện thoại không được để trống" };
  }

  console.log("Dữ liệu bác sĩ trước khi lưu vào DB: ", {
    ...restData,
    email,
    phone,
    imageUrl,
    title,
    description,
    certifications,
  });

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: "Tài khoản đã tồn tại" };
    }

    // Check if the phone is already registered
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return { success: false, message: "Số điện thoại đã được sử dụng" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new doctor user with all required fields
    const newDoctor = new User({
      ...restData,
      password: hashedPassword,
      role: "doctor",
      imageUrl,
      email,
      phone,
      title,
      description,
      certifications,
    });

    // Save the new doctor to the database
    await newDoctor.save();

    return { success: true, user: newDoctor };
  } catch (error) {
    console.error("Lỗi khi tạo bác sĩ: ", error);
    return { success: false, message: "Lỗi khi tạo bác sĩ" };
  }
};

exports.createPatient = async (patientData) => {
  const { email, password, imageUrl, ...restData } = patientData;

  if (!password) {
    return { success: false, message: "Mật khẩu không được để trống" };
  }

  if (!email) {
    return { success: false, message: "Email không được để trống" };
  }

  console.log("Dữ liệu bệnh nhân trước khi lưu vào DB: ", {
    ...restData,
    email,
    imageUrl,
  });

  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: "Tài khoản đã tồn tại" };
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo bệnh nhân mới
    const newPatient = new User({
      ...restData,
      password: hashedPassword,
      role: "patient", // Đặt role là bệnh nhân
      imageUrl,
      email,
    });

    // Lưu bệnh nhân vào DB
    await newPatient.save();

    return { success: true, user: newPatient }; // Trả về bệnh nhân vừa được tạo
  } catch (error) {
    console.error("Lỗi khi tạo bệnh nhân: ", error);
    return { success: false, message: "Lỗi khi tạo bệnh nhân" };
  }
};

// Lay tat ca nguoi dung theo role
exports.getAllUsersByRole = async (role, page = 1, limit = 5) => {
  try {
    if (role && role === "admin") {
      return { message: "Bạn không có quyền xem thông tin admin" };
    }

    const skip = (page - 1) * limit; // Bỏ qua số lượng người dùng ở các trang trước
    const users = await User.find({ role })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments({ role }); // Tổng số người dùng có role tương ứng
    const totalPages = Math.ceil(totalUsers / limit); // Tổng số trang

    return { success: true, users, totalUsers, totalPages, currentPage: page };
  } catch (error) {
    console.error(
      `Lỗi khi lấy thông tin người dùng với vai trò ${role}: `,
      error
    );
    return {
      success: false,
      message: `Lỗi khi lấy thông tin người dùng với vai trò ${role}`,
    };
  }
};

// Hàm lấy tất cả bác sĩ theo chuyên khoa
exports.getAllDoctorsBySpecialty = async (specialty) => {
  try {
    // Chuyển chuyên khoa truyền vào thành chữ thường để so sánh
    const lowerCaseSpecialty = specialty.toLowerCase();
    console.log("Specialty được truyền vào (chữ thường):", lowerCaseSpecialty);

    // Tìm các bác sĩ có role là 'doctor'
    const doctors = await User.find({ role: "doctor" });

    // Lọc các bác sĩ có chuyên khoa trùng khớp
    const matchingDoctors = doctors.filter(doctor => {
      const lowerCaseSpecialties = doctor.specialties.map(s => s.toLowerCase().split(",").map(specialty => specialty.trim())).flat();
      
      return lowerCaseSpecialties.includes(lowerCaseSpecialty);
    });

    if (!matchingDoctors.length) {
      return { success: false, message: "Không tìm thấy bác sĩ trong chuyên khoa này" };
    }

    // Trả về danh sách các bác sĩ phù hợp
    return { success: true, doctors: matchingDoctors };
  } catch (error) {
    console.error("Lỗi khi lấy thông tin bác sĩ theo chuyên khoa ", error);
    return { success: false, message: "Lỗi khi lấy thông tin bác sĩ theo chuyên khoa" };
  }
};
// lay tat ca nguoi dung theo role va id
exports.getUserById = async (userId, role) => {
  try {
    const user = await User.findOne({ _id: userId, role });
    if (!user) {
      return {
        success: false,
        message: `Không tìm thấy người dùng với vai trò ${role}`,
      };
    }
    return { success: true, user };
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng: ", error);
    return { success: false, message: "Lỗi khi lấy thông tin người dùng" };
  }
};

// get all theo chuyen khoa

// cap nhat thong tin nguoi dung theo id
exports.updateUser = async (userId, userData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { ...userData },
      { new: true }
    );
    if (!updatedUser) {
      return { success: false, message: "Không tìm thấy người dùng" };
    }
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng: ", error);
    return { success: false, message: "Lỗi khi cập nhật thông tin người dùng" };
  }
};

// Xoa nguoi dung theo id
exports.deleteUser = async (userId) => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: userId });
    if (!deletedUser) {
      return { success: false, message: "Không tìm thấy người dùng" };
    }
    return { success: true, message: "Xóa người dùng thành công" };
  } catch (error) {
    console.error("Lỗi khi xóa người dùng: ", error);
    return { success: false, message: "Lỗi khi xóa người dùng" };
  }
};

// Tìm kiếm bác sĩ theo tên hoặc chuyên khoa
exports.searchDoctors = async (search, page, limit) => {
  try {
    const skip = (page - 1) * limit;

   

    const matchStage = {
      role: "doctor", // Chỉ lấy bác sĩ
      ...(search && {
        $or: [
          { full_name: { $regex: search, $options: "i" } },
          { specialties: { $regex: search, $options: "i" } },
        ],
      }),
    };

    const doctors = await User.aggregate([
      {
        $addFields: {
          full_name: { $concat: ["$first_name", " ", "$last_name"] },
        },
      },
      {
        $match: matchStage, // Lọc theo vai trò và từ khóa
      },
      { $skip: skip },
      { $limit: Number(limit) },
    ]);


    
    const total = await User.aggregate([
      {
        $addFields: {
          full_name: { $concat: ["$first_name", " ", "$last_name"] },
        },
      },
      {
        $match: matchStage,
      },
      { $count: "total" },
    ]);

    const totalCount = total[0]?.total || 0;

    return { doctors, totalCount };
  } catch (error) {
    console.error("Error in searchDoctors:", error);
    throw error;
  }
};



