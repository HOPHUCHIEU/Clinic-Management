const express = require("express");
const router = express.Router();
const medicationController = require("../controllers/medicationController");

router.get("/total-sales", medicationController.getTotalSales);
router.get("/best-selling-medication", medicationController.getBestSellingMedication);
router.get("/total-sales-today", medicationController.getTotalSalesToday);
router.get("/monthly-sales", medicationController.getMonthlySales);
router.get("/daily-sales/:medicationId", medicationController.getDailySales);
router.get("/year-sales/:year", medicationController.getYearlySales);
router.get("/monthly-revenue/:year", medicationController.getMonthlyRevenue);

module.exports = router;