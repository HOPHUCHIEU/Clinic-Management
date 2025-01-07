import axios from "../../config/axios.customize";

const getTotalSales = async () => {
  return axios.get('/api/medications/total-sales', {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getBestSellingMedication = async () => {
  return axios.get('/api/medications/best-selling-medication', {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getTotalSalesToday = async () => {
  return axios.get('/api/medications/total-sales-today', {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getMonthlySales = async () => {
  return axios.get('/api/medications/monthly-sales', {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getDailySales = async (medicationId) => {
  return axios.get(`/api/medications/daily-sales/${medicationId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getYearlySales = async (year) => {
  return axios.get(`/api/medications/year-sales/${year}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getMonthlyRevenue = async (year) => {
  return axios.get(`/api/medications/monthly-revenue/${year}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export { getTotalSales, getBestSellingMedication, getTotalSalesToday, getMonthlySales, getDailySales, getYearlySales, getMonthlyRevenue };