const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medicationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    unit_of_caculation: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    quantity_available: {
      type: Number,
      required: true,
      min: 0, // Số lượng không được âm
    },
    price: {
      type: Number,
      min: 0, // Giá không được âm
    },
    medicalImage: {
      type: String, 
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Medication", medicationSchema);
