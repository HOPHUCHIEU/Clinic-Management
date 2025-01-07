const MedicalRecord = require("../models/MedicalRecord");
const Medication = require("../models/Medication");
const Prescription = require("../models/Prescription");

//lấy tất cả hồ sơ bệnh án
exports.getMedicalRecord = async (page = 1, limit = 5) => {
    try {
        const skip = (page - 1) * limit;
        const medicalRecords = await MedicalRecord.find()
            .sort({ createAt: -1 })
            .skip(skip)
            .limit(limit)
        const totalMedicalRecords = await MedicalRecord.countDocuments()
        const totalPages = Math.ceil(totalMedicalRecords / limit)

        return {
            success: true,
            medicalRecords,
            totalMedicalRecords,
            totalPages,
            currentPage: page,
        }
    } catch (e) {
        console.error("Lỗi khi lấy danh sách thuốc: ", error)
        return { success: false, message: "Lỗi khi lấy danh sách thuốc" }
    }
}

// Lấy hồ sơ bệnh án theo ID bệnh nhân
exports.getMedicalRecordByPatientId = async (patientId) => {
  try {
    const medicalRecord = await MedicalRecord.findOne({ patient_id: patientId })
      .populate({
        path: 'medical_history.prescriptions',
        populate: {
          path: 'medications.medication_id',
          model: 'Medication'
        }
      })
      .populate('patient_id', 'first_name last_name birthdate gender address')
      .populate('medical_history.doctor_id', 'first_name last_name email phone'); // Populate doctor details

    if (!medicalRecord) {
      return { success: false, message: "Không tìm thấy hồ sơ bệnh án" };
    }

    medicalRecord.medical_history.forEach(visit => {
      visit.total_price = visit.prescriptions.reduce((total, prescription) => total + prescription.total_price, 0);
    });

    return { success: true, medicalRecord };
  } catch (error) {
    console.error("Lỗi khi lấy hồ sơ bệnh án:", error);
    return { success: false, message: "Lỗi khi lấy hồ sơ bệnh án" };
  }
};

// tạo hồ sơ bệnh án
exports.createMedicalRecord = async (patientid) => {
    try {
        const existingRecord = await MedicalRecord.findOne({ patient_id: patientid })

        if (existingRecord) {
            return {
                success: true,
                medicalRecord: existingRecord,
                message: "Bệnh nhân đã có hồ sơ y tế"
            };
        }
        const newMedicalRecord = new MedicalRecord({
            patient_id: patientid,
            medical_history: []
        })
        const saveRecord = await newMedicalRecord.save();
        return {
            success: true,
            medicalRecord: saveRecord,
            message: "Đã tạo hồ sơ y tế mới"
        };
    } catch (error) {
        console.error("Lỗi khi tạo hồ sơ y tế", error)
        return {
            success: false,
            message: "Lỗi khi tạo hồ sơ y tế"
        }
    }
}

// Bác sĩ thêm thông tin sau mỗi lần khám
exports.addVisitHistory = async (patientId, visitData) => {
  try {
    const medicalRecord = await MedicalRecord.findOne({ patient_id: patientId });

    if (!medicalRecord) {
      return { success: false, message: "Không tìm thấy hồ sơ bệnh án" };
    }

    const visit = {
      doctor_id: visitData.doctorId,
      visit_date: new Date(),
      symptoms: visitData.symptoms,
      diagnosis: visitData.diagnosis,
      treatment_plan: visitData.treatmentPlan,
      notes: visitData.notes,
      prescriptions: [],
      total_price: 0
    };

    // Add visit to medical history and save to get visit_id
    medicalRecord.medical_history.push(visit);
    await medicalRecord.save();

    // Get the newly added visit's ID
    const newVisit = medicalRecord.medical_history[medicalRecord.medical_history.length - 1];

    // Fetch medication details from the database
    const medications = await Promise.all(visitData.medications.map(async (med) => {
      const medication = await Medication.findOne({ name: med.medication_name });
      if (!medication) {
        throw new Error(`Medication not found: ${med.medication_name}`);
      }
      return {
        medication_id: medication._id,
        medication_name: med.medication_name,
        quantity: med.quantity,
        dosage: med.dosage,
        price: medication.price, // Assuming the Medication schema has a price field
        total_price: med.quantity * medication.price
      };
    }));

    // Create a single prescription for the visit
    const prescription = new Prescription({
      visit_id: newVisit._id,
      doctor_id: visitData.doctorId,
      patient_id: patientId,
      medications: medications,
      total_price: medications.reduce((total, med) => total + med.total_price, 0)
    });

    const savedPrescription = await prescription.save();
    newVisit.prescriptions.push(savedPrescription._id);

    // Calculate total price
    newVisit.total_price = savedPrescription.total_price;

    // Save the updated medical record with the new visit and prescription
    await medicalRecord.save();

    // Update the quantity available for each medication
    await Promise.all(medications.map(async (med) => {
      await Medication.updateOne(
        { _id: med.medication_id },
        { $inc: { quantity_available: -med.quantity } }
      );
    }));

    console.log("Visit added successfully:", newVisit);
    return { success: true, visit: newVisit };
  } catch (error) {
    console.error("Lỗi khi thêm thông tin khám bệnh:", error);
    return { success: false, message: "Lỗi khi thêm thông tin khám bệnh" };
  }
};