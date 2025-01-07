const medicalRecordService = require('../service/medicalRecordService');

// Lấy tất cả hồ sơ bệnh án (phân trang)
exports.getAllMedicalRecords = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const result = await medicalRecordService.getMedicalRecord(page, limit);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi controller - getAllMedicalRecords:", error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server khi lấy danh sách hồ sơ bệnh án" 
        });
    }
};

// Lấy hồ sơ bệnh án theo ID bệnh nhân
exports.getMedicalRecordByPatientId = async (req, res) => {
    try {
        const { patientId } = req.params;
        const result = await medicalRecordService.getMedicalRecordByPatientId(patientId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi controller - getMedicalRecordByPatientId:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy hồ sơ bệnh án"
        });
    }
};

// Thêm thông tin khám bệnh mới
exports.addVisitHistory = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const visitData = {
      doctorId: req.body.doctorId,
      symptoms: req.body.symptoms,
      diagnosis: req.body.diagnosis,
      treatmentPlan: req.body.treatmentPlan,
      notes: req.body.notes,
      medications: req.body.medications
    };


    const result = await medicalRecordService.addVisitHistory(patientId, visitData);

    if (!result.success) {
      console.error("Error adding visit:", result.message);
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi controller - addVisitHistory:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm thông tin khám bệnh"
    });
  }
};

// Tạo hồ sơ bệnh án mới (thường được gọi tự động khi đặt lịch)
exports.createMedicalRecord = async (req, res) => {
    try {
        const {patientId} = req.body;
        const result = await medicalRecordService.createMedicalRecord(patientId);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.status(201).json(result);
    } catch (error) {
        console.error("Lỗi controller - createMedicalRecord:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi tạo hồ sơ bệnh án"
        });
    }
};