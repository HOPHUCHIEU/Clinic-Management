import React, { useEffect, useState } from "react";
import {
  getMonthlyAppointmentCountByDoctor,
  getAverageConsultationTimeByDoctor,
  getDailyAppointmentCountByDoctor,
} from "../../utils/StaticsAPI/StaticsService";
import { Table, Tag, Statistic, Row, Col } from "antd"; // Thêm Statistic từ Ant Design
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../../style/Statics/StatisticsByDoctor.scss"; // Import file SCSS

const StatisticsByDoctor = () => {
  const [monthlyAppointmentData, setMonthlyAppointmentData] = useState([]);
  const [averageConsultationData, setAverageConsultationData] = useState([]);
  const [dailyAppointmentData, setDailyAppointmentData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await getMonthlyAppointmentCountByDoctor();
      if (response.success) {
        setMonthlyAppointmentData(response.data);
      }

      const avgResponse = await getAverageConsultationTimeByDoctor();
      if (avgResponse.success) {
        setAverageConsultationData(avgResponse.data);
      }

      const dailyResponse = await getDailyAppointmentCountByDoctor();
      if (dailyResponse.success) {
        setDailyAppointmentData(dailyResponse.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Tính tổng số bệnh nhân tháng này
  const totalMonthlyPatients = monthlyAppointmentData.reduce(
    (acc, curr) => acc + curr.count, 0
  );

  // Tính tổng số bệnh nhân hôm nay
  const totalDailyPatients = dailyAppointmentData.reduce(
    (acc, curr) => acc + curr.count, 0
  );

  const monthlyColumns = [
    {
      title: "Tên bác sĩ",
      dataIndex: "doctor_name",
      key: "doctor_name",
    },
    {
      title: "Chuyên ngành",
      dataIndex: "specialties",
      key: "specialties",
      render: (specialties) => (
        <>
          {specialties.map((specialty, index) => (
            <Tag color="blue" key={index}>
              {specialty}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Số bệnh nhân",
      dataIndex: "count",
      key: "count",
    },
  ];

  const dailyColumns = [
    {
      title: "Tên bác sĩ",
      dataIndex: "doctor_name",
      key: "doctor_name",
    },
    {
      title: "Số bệnh nhân hôm nay",
      dataIndex: "count",
      key: "count",
    },
  ];

  return (
    <div className="statistics-container">
      {/* Bảng Tóm tắt */}
      <div className="summary">
        <h2>Bảng Tóm tắt</h2>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Tổng số bệnh nhân tháng này" value={totalMonthlyPatients} />
          </Col>
          <Col span={8}>
            <Statistic title="Tổng số bệnh nhân hôm nay" value={totalDailyPatients} />
          </Col>
          <Col span={8}>
            <Statistic title="Thời gian khám trung bình" value={averageConsultationData.length ? averageConsultationData.reduce((acc, curr) => acc + curr.avg_consultation_time, 0) / averageConsultationData.length : 0} precision={2} suffix="phút" />
          </Col>
        </Row>
      </div>

      <div className="table">
        <h2>Thống kê số lượng bệnh nhân khám theo bác sĩ theo tháng</h2>
        <Table
          columns={monthlyColumns}
          dataSource={monthlyAppointmentData}
          rowKey={(record) => record.doctor_id}
          pagination={{ pageSize: 5 }}
        />
      </div>

      <div className="daily-table">
        <h2>Số lượng bệnh nhân khám hôm nay</h2>
        <Table
          columns={dailyColumns}
          dataSource={dailyAppointmentData}
          rowKey={(record) => record.doctor_id}
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* Biểu đồ cho Số lượng Bệnh nhân Hàng ngày */}
      <div className="daily-chart">
        <h2>Biểu đồ số lượng bệnh nhân hôm nay</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyAppointmentData}>
            <XAxis dataKey="doctor_name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3357FF" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart">
        <h2>Thời gian khám trung bình của bác sĩ</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={averageConsultationData}>
            <XAxis dataKey="doctor_name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avg_consultation_time" fill="#3357FF" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatisticsByDoctor;
