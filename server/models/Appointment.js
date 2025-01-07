// models/Appointment.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema(
  {
    appointment_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "pending",
    },
    time_slot: {
      type: String,
      required: true,
    },
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
    note: {
      type: String,
      default: '',
    },
    appointment_type: {
      type: String,
      enum: ["in-person", "online"],
      required: true,
    },
    video_call_link: {
      type: String,
      default: '',
      validate: {
        validator: function (value) {
          // Chỉ cần link nếu kiểu khám là online
          return this.appointment_type === "online" ? value.length > 0 : true;
        },
        message: "Video call link is required for online appointments",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
