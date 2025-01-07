// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./config/mongoDB");
const seedAdmin = require("./seeders/seedAdmin");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const BlogRoutes = require("./routes/BlogRouter");
const medicineRoutes = require("./routes/medicineRoutes");
const ScheduleRoutes = require("./routes/scheduleRoutes");
const userRoutes = require("./routes/userRoutes");
const AppointmentRoutes = require("./routes/appointmentRoutes");
const StaticsRoutes = require("./routes/statics");
const MedicalRecordRoutes = require("./routes/medicalRecordRoutes");
const medicationRoutes = require('./routes/medicationRoutes'); 


const EmailRouter = require("./routes/emailRouters");
const app = express();

// Middleware

app.use(express.json({ limit: "10mb" })); // Ví dụ: tăng lên 10MB
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Kết nối database
connection();

// Seed Admin
seedAdmin();

// CORS
app.use(cors());
// cors()
// {
//   origin: 'http://localhost:5173/', // URL của frontend
//   credentials: true // Cho phép gửi cookie kèm theo request
// }
// );

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/blog", BlogRoutes);
app.use("/api/schedule", ScheduleRoutes);
app.use("/api/user", userRoutes);
app.use("/api/appointment", AppointmentRoutes);
app.use("/api/statics", StaticsRoutes);
app.use("/api/medicalRecord", MedicalRecordRoutes);
app.use('/api/medications', medicationRoutes);

app.use("/api/email", EmailRouter);
// Khởi tạo server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
