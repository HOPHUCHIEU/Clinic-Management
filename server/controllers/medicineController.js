const { response } = require("express");
const {
  createMedicine,
  getAllMedicines,
  updateMedicine,
  deleteMedicine,
} = require("../service/medicineService");

// tạo mới một loại thuốc
exports.createMedicine = async (req, res) => {
  try {
    const response = await createMedicine(req.body);

    if (response.success) {
      return res.status(201).json({
        success: true,
        message: "Tạo thuốc thành công",
        medicine: response.medicine,
      });
    } else {
      return res.status(400).json({ message: response.message });
    }
  } catch (error) {
    console.error("Lỗi server khi tạo thuốc:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

exports.getAllMedicines = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Trang hiện tại
  const limit = parseInt(req.query.limit) || 5; // Số lượng thuốc mỗi trang
  const search = req.query.search || ""; // Từ khóa tìm kiếm (mặc định là rỗng)

  try {
    // Gọi hàm lấy danh sách thuốc, truyền thêm tham số search
    const response = await getAllMedicines(page, limit, search);

    if (response.success) {
      return res.status(200).json({
        success: true,
        message: "Lấy danh sách thuốc thành công",
        medicines: response.medicines, // Danh sách thuốc
        currentPage: response.currentPage, // Trang hiện tại
        totalPages: response.totalPages, // Tổng số trang
      });
    } else {
      return res.status(404).json({
        success: false,
        message: response.message,
      });
    }
  } catch (error) {
    console.error("Error fetching medicines:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách thuốc",
      error,
    });
  }
};

// cập nhật thông tin thuốc theo id
exports.updateMedicine = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await updateMedicine(id, req.body);

    if (response.success) {
      return res.status(200).json({
        success: true,
        message: "Cập nhật thông tin thuốc thành công",
        medicine: response.medicine,
      });
    } else {
      return res.status(404).json({ message: response.message });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server khi cập nhật thông tin thuốc", error });
  }
};

// xóa thuốc theo id
exports.deleteMedicine = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await deleteMedicine(id);

    if (response.success) {
      return res.status(200).json({
        success: true,
        message: "Xóa thuốc thành công",
      });
    } else {
      return res.status(404).json({ message: response.message });
    }
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server khi xóa thuốc", error });
  }
};
