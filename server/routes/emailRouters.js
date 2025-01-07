const express = require('express');
const { sendEmail,sendCancellationReason } = require('../controllers/EmailController');

const router = express.Router();

// Định nghĩa route cho API gửi email
router.post('/send-email', sendEmail);
router.post('/send-cancellation-reason', sendCancellationReason);

// Xuất router để sử dụng trong server.js
module.exports = router;