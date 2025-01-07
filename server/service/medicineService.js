const Medication = require("../models/Medication");

// tạo mới một loại thuốc
exports.createMedicine = async (medicineData) => {
  try {
    const medicine = new Medication(medicineData);
    await medicine.save();
    return { success: true, medicine };
  } catch (error) {
    console.error("Lỗi khi tạo thuốc: ", error);
    return { success: false, message: "Lỗi khi tạo thuốc" };
  }
};

// lấy tất cả loại thuốc
exports.getAllMedicines = async (page = 1, limit = 5, search = "") => {
  try {
    const skip = (page - 1) * limit;

    // Tạo điều kiện tìm kiếm
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } }, // Tìm theo tên (không phân biệt hoa thường)
            { description: { $regex: search, $options: "i" } }, // Tìm trong mô tả
          ],
        }
      : {};

    const medicines = await Medication.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalMedicines = await Medication.countDocuments(query);
    const totalPages = Math.ceil(totalMedicines / limit);

    return {
      success: true,
      medicines,
      totalMedicines,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thuốc: ", error);
    return { success: false, message: "Lỗi khi lấy danh sách thuốc" };
  }
};

// cập nhật thông tin thuốc theo id
exports.updateMedicine = async (medicineId, medicineData) => {
  try {
    const updatedMedicine = await Medication.findByIdAndUpdate(
      { _id: medicineId },
      { ...medicineData },
      { new: true }
    );
    if (!updatedMedicine) {
      return { success: false, message: "Không tìm thấy thuốc" };
    }
    return { success: true, medicine: updatedMedicine };
  } catch (error) {
    console.error("Lỗi khi cập nhật thuốc: ", error);
    return { success: false, message: "Lỗi khi cập nhật thuốc" };
  }
};

// xóa thuốc theo id
exports.deleteMedicine = async (medicineId) => {
  try {
    const deletedMedicine = await Medication.findByIdAndDelete({
      _id: medicineId,
    });
    if (!deletedMedicine) {
      return { success: false, message: "Không tìm thấy thuốc" };
    }
    return { success: true };
  } catch (error) {
    console.error("Lỗi khi xóa thuốc: ", error);
    return { success: false, message: "Lỗi khi xóa thuốc" };
  }
};
