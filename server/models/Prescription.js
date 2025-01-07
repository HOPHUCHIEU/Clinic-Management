const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
   description: {
      type: String, // Ghi chú thêm về đơn thuốc
   },
   medications: [
      {
         medication_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Medication",
         },
         quantity: {
            type: Number,
            required: true,
         },
         dosage: {
            type: String, // Ví dụ: "2 viên, 3 lần/ngày"
            required: true,
         },
         price: {
            type: Number,
            required: true,
         },
      },
   ],
   patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
   },
   doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
   },
   visit_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "MedicalRecord.medical_history",
    },
   total_price: {
      type: Number,
      required: true,
      min: 0,
   },
}, { timestamps: true });

module.exports = mongoose.model("Prescription", prescriptionSchema);
