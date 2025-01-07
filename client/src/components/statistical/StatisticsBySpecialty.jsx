import React, { useEffect, useState } from "react";
import {
  getAppointmentCountBySpecialties,
  getTodayAppointmentCount,
  getDailyAppointmentCountByDoctor,
} from "../../utils/StaticsAPI/StaticsService";
import {
  BarChart,
  Tooltip,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "../../style/Statics/StatisticsBySpecialty.scss";
import totalAppointMentToDay from "../../assets/iconStatics/appointment (2).png";
import png1 from "../../assets/iconStatics/quality.png";
import png2 from "../../assets/iconStatics/clinic-history.png";
const StaticsBySpecialty = () => {
  const [specialtiesData, setSpecialtiesData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [totalAppointmentCount, setTotalAppointmentCount] = useState(null);
  const [monthlyAppointmentCount, setMonthlyAppointmentCount] = useState(null);
  const [topSpecialties, setTopSpecialties] = useState("");

  const fetchData = async () => {
    try {
      const data = await getAppointmentCountBySpecialties();
      const todayCount = await getTodayAppointmentCount();

      setTotalAppointmentCount(todayCount.count);
      setCurrentMonth(data.month);

      // Convert data for the chart and calculate the monthly total
      const formattedData = Object.entries(data.data).map(
        ([specialty, count]) => ({
          name: specialty,
          count,
        })
      );

      // Calculate the total appointments for the current month
      const monthlyTotal = formattedData.reduce(
        (sum, specialty) => sum + specialty.count,
        0
      );
      setMonthlyAppointmentCount(monthlyTotal);

      // Find the highest appointment count
      const maxCount = Math.max(
        ...formattedData.map((specialty) => specialty.count)
      );

      // Get all specialties with the highest appointment count
      const topSpecialtiesArray = formattedData
        .filter((specialty) => specialty.count === maxCount)
        .map((specialty) => specialty.name);

      // Join the top specialties with commas
      setTopSpecialties(topSpecialtiesArray.join(", "));

      setSpecialtiesData(formattedData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="statistics-container">
      <h2>Thống kê số buổi khám trong tháng {currentMonth}</h2>
      <div className="total-container">
        <div className="total_child">
          <h2>Số buổi khám hôm nay</h2>
          <div className="icons_number">
            <img src={totalAppointMentToDay} alt="" className="icons" />
            <span>{totalAppointmentCount}</span>
          </div>
        </div>
        <div className="total_child">
          <h2>Tổng số buổi khám tháng này</h2>
          <div className="icons_number">
            <img src={png2} alt="" className="icons" />
            <span>{monthlyAppointmentCount}</span>
          </div>
        </div>
        <div
          className="total_child"
          style={{
            flex: "1.2",
          }}
        >
          <h2>Khoa được khám nhiều nhất trong tháng này</h2>
          <div className="icons_number">
            <img src={png1} alt="" className="icons" />
            <span style={{ fontSize: "27px" }}>{topSpecialties}</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="80%" height={400}>
        <BarChart data={specialtiesData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar name="Số lượng" dataKey="count" barSize={40} fill="#3357FF" />
        </BarChart>
      </ResponsiveContainer>
      <span style={{
        fontSize:"21px",
        fontWeight:"bold",
        marginLeft:"30px",
        marginTop:"20px",
        marginBottom:"30px",
        display:"block",

      }}>
        Biểu đồ thống kê số lượng bệnh nhân khám theo từng khoa trong tháng{" "}
        {currentMonth}
      </span>
    </div>
  );
};

export default StaticsBySpecialty;
