const medicationService = require("../service/medicationService");

exports.getTotalSales = async (req, res) => {
  try {
    const salesReport = await medicationService.getTotalSales();
    res.json(salesReport);
  } catch (error) {
    res.status(500).json({ message: "Error generating total sales report: " + error.message });
  }
};

exports.getBestSellingMedication = async (req, res) => {
  try {
    const bestSellingMedication = await medicationService.getBestSellingMedication();
    res.json(bestSellingMedication);
  } catch (error) {
    res.status(500).json({ message: "Error generating best selling medication report: " + error.message });
  }
};

exports.getTotalSalesToday = async (req, res) => {
  try {
    const salesReport = await medicationService.getTotalSalesToday();
    res.json(salesReport);
  } catch (error) {
    res.status(500).json({ message: "Error generating today's sales report: " + error.message });
  }
};

exports.getMonthlySales = async (req, res) => {
  try {
    const salesReport = await medicationService.getMonthlySales();
    res.json(salesReport);
  } catch (error) {
    res.status(500).json({ message: "Error generating monthly sales report: " + error.message });
  }
};

exports.getDailySales = async (req, res) => {
  try {
    const medicationId = req.params.medicationId;
    const salesReport = await medicationService.getDailySales(medicationId);
    res.json(salesReport);
  } catch (error) {
    res.status(500).json({ message: "Error generating daily sales report: " + error.message });
  }
};

exports.getYearlySales = async (req, res) => {
  try {
    const year = parseInt(req.params.year, 10);
    const salesReport = await medicationService.getYearlySales(year);
    res.json(salesReport);
  } catch (error) {
    res.status(500).json({ message: "Error generating yearly sales report: " + error.message });
  }
};

exports.getMonthlyRevenue = async (req, res) => {
  try {
    const year = parseInt(req.params.year, 10);
    const revenueReport = await medicationService.getMonthlyRevenue(year);
    res.json(revenueReport);
  } catch (error) {
    res.status(500).json({ message: "Error generating monthly revenue report: " + error.message });
  }
};