const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(403)
      .json({ message: "Không có token, truy cập bị từ chối" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
   
    return res.status(401).json({ message: "Token không hợp lệ" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin người dùng đã xác thực vào req
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ", error });
  }
};
