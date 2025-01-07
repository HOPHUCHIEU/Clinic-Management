const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const visitSchema = new Schema({
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  visit_date: {
    type: Date,
    required: true,
  },
  symptoms: {
    type: [String],
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  treatment_plan: {
    type: String,
    required: true,
  },
  notes: {
    type: [String],
  },
  prescriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription"
  }],
  total_price: {
    type: Number,
    default: 0,
  },
});

const medicalRecordSchema = new Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    medical_history: [visitSchema]
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
