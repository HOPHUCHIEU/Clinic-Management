const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    last_name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    email: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10,15}$/,
    },
    address: {
      type: String,
      maxlength: 100,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Nam", "Nữ"],
    },
    role: {
      type: String,
      required: true,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    password: {
      type: String,
      required: true,
    },
    birthdate: {
      type: String,
      required: true,
    },
    specialties: {
      type: [String],
    },
    experience: { type: String },
    imageUrl: { type: String },
    title: {
      type: String,
      required: function () {
        return this.role === "doctor";
      },
    },
    description: {
      type: String,
      maxlength: 500, // Optional, with a character limit
    }, // Description for doctors
    certifications: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length <= 3; // Limit to 3 images
        },
        message: "A maximum of 3 certification images is allowed.",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
