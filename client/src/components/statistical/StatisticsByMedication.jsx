import React, { useEffect, useState } from "react";
import { Table, Statistic, Row, Col } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getTotalSales,
  getBestSellingMedication,
  getTotalSalesToday,
  getMonthlySales,
  getDailySales,
} from "../../utils/StaticsAPI/medicationService";
import "../../style/Statics/StatisticsByDoctor.scss"; // Import file SCSS

const StatisticsByMedication = () => {
  const [totalSalesData, setTotalSalesData] = useState([]);
  const [bestSellingMedicationData, setBestSellingMedicationData] = useState(null);
  const [totalSalesTodayData, setTotalSalesTodayData] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [dailySalesData, setDailySalesData] = useState([]);

  const fetchData = async () => {
    try {
      const totalSalesResponse = await getTotalSales();
      if (totalSalesResponse) {
        setTotalSalesData(totalSalesResponse);
      }

      const bestSellingResponse = await getBestSellingMedication();
      if (bestSellingResponse) {
        setBestSellingMedicationData(bestSellingResponse);
      }

      const totalSalesTodayResponse = await getTotalSalesToday();
      if (totalSalesTodayResponse) {
        setTotalSalesTodayData(totalSalesTodayResponse);
      }

      const monthlySalesResponse = await getMonthlySales();
      if (monthlySalesResponse) {
        setMonthlySalesData(monthlySalesResponse);
      }

      // const dailySalesResponse = await getDailySales("67556857ede5c936a28b04bc"); 
      // if (dailySalesResponse) {
      //   setDailySalesData(dailySalesResponse);
      // }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalMonthlySales = monthlySalesData.reduce(
    (acc, curr) => acc + curr.totalQuantity, 0
  );

//   const totalDailySales = dailySalesData.reduce(
//     (acc, curr) => acc + curr.totalQuantity, 0
//   );
  const totalDailySales = totalSalesTodayData.reduce(
    (acc, curr) => acc + curr.totalQuantity, 0
  );

  const monthlyColumns = [
    {
      title: "Tháng",
      dataIndex: "_id",
      key: "month",
      render: (_id) => `${_id.month}/${_id.year}`,
    },
    {
      title: "Tên thuốc",
      dataIndex: "medicationName",
      key: "medicationName",
    },
    {
      title: "Tổng số lượng ",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
    },
    {
      title: "Tổng lợi nhuận",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
    },
  ];

  const dailyColumns = [
    {
      title: "Tên thuốc",
      dataIndex: "medicationName",
      key: "medicationName",
    },
    {
      title: "Tổng số lượng",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
    },
    {
      title: "Tổng lợi nhuận",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
    },
  ];

  return (
    <div className="statistics-container">
      {/* Bảng Tóm tắt */}
      <div className="summary">
        <h2>Bảng Tóm tắt</h2>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Tổng số thuốc bán tháng này" value={totalMonthlySales} />
          </Col>
          <Col span={8}>
            <Statistic title="Tổng số thuốc bán hôm nay" value={totalDailySales} />
          </Col>
          <Col span={8}>
            <Statistic title="Thuốc bán chạy nhất" value={bestSellingMedicationData ? bestSellingMedicationData.medicationName : "N/A"} />
          </Col>
        </Row>
      </div>

      <div className="table">
        <h2>Thống kê số lượng thuốc bán theo tháng</h2>
        <Table
          columns={monthlyColumns}
          dataSource={monthlySalesData}
          rowKey={(record) => `${record._id.year}-${record._id.month}-${record._id.medication_id}`}
          pagination={{ pageSize: 5 }}
        />
      </div>

      <div className="daily-table">
        <h2>Số lượng thuốc bán hôm nay</h2>
        <Table
          columns={dailyColumns}
          dataSource={totalSalesTodayData}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* Biểu đồ cho Số lượng thuốc bán hôm nay */}
      <div className="daily-chart">
        <h2>Biểu đồ số lượng thuốc bán hôm nay</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={totalSalesTodayData}>
            <XAxis dataKey="medicationName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalQuantity" fill="#3357FF" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart">
        <h2>Biểu đồ doanh thu thuốc bán theo tháng</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlySalesData}>
            <XAxis dataKey="medicationName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalRevenue" fill="#3357FF" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatisticsByMedication;