import React from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import { useNavigate } from "react-router-dom";
import analyzeInput from "./AnalyzeChatbot";

const theme = {
  botName: "tư vấn bệnh",
  background: "#f5f8fb",
  fontFamily: "Time New Roman",
  headerBgColor: "#0866FF",
  headerFontColor: "#fff",
  headerFontSize: "20px",
  botBubbleColor: "#0866FF",
  botFontColor: "#fff",
  userBubbleColor: "#fff",
  userFontColor: "#4CAF50",
};

// function OpenLink() {
//   React.useEffect(() => {
//     window.open("https://forms.gle/MZtdJ7ToHZriTJvN9", "_blank");
//   }, []);

//   return <span>Đang chuyển hướng tới trang đặt lịch khám nhanh...</span>;
// }

function ChooseDoctor() {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate("/dich-vu-kham");
  }, [navigate]);

  return <span>Đang chuyển hướng tới trang bảng giá dịch vụ</span>;
}

function BookDirectAppointment() {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate("/dat-kham/bac-si/tim-kiem");
  }, [navigate]);

  return <span>Mời bạn chọn bác sĩ và đặt khám lịch</span>;
}

function RedirectToIntroduction() {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate("/gioi-thieu");
  }, [navigate]);

  return <span>Đang chuyển hướng tới trang giới thiệu...</span>;
}

function NewChatBot() {
  return (
    <ThemeProvider theme={theme}>
      <ChatBot
        steps={[
          {
            id: "1",
            message: `Chào bạn, tôi là trợ lý ảo ${theme.botName}❤️❤️. Tên bạn là gì ạ?`,
            trigger: "2",
          },
          { id: "2", user: true, trigger: "3" },
          {
            id: "3",
            message: "Chào bạn {previousValue}, bạn muốn hỏi về vấn đề gì?",
            trigger: "4",
          },
          { id: "4", user: true, trigger: "5" },
          {
            id: "5",
            message: ({ previousValue }) => analyzeInput(previousValue),
            trigger: ({ previousValue }) =>
              analyzeInput(previousValue) === "Mời bạn chọn đặt lịch"
                ? "10"
                : "6",
          },
          {
            id: "6",
            options: [
              {
                value: "Đặt lịch khám trực tiếp",
                label: "Chọn bác sĩ",
                trigger: "7",
              },
              // {
              //   value: "Đặt lịch khám nhanh",
              //   label: "Đặt lịch khám nhanh",
              //   trigger: "8",
              // },
              {
                value: "Giới thiệu về phòng khám",
                label: "Giới thiệu về phòng khám",
                trigger: "11",
              },
              {
                value: "Dịch vụ khám",
                label: "Dịch vụ khám",
                trigger: "10",
              },
              {
                value: "Tiếp tục hỏi",
                label: "Tiếp tục hỏi",
                trigger: "4",
              },
            ],
          },
          {
            id: "7",
            component: <BookDirectAppointment />,
            asMessage: true,
            trigger: "4",
          },
          // { id: "8", component: <OpenLink />, asMessage: true, trigger: "9" },
          {
            id: "9",
            message: "Cảm ơn bạn đã chọn đặt lịch khám nhanh.",
            trigger: "4",
          },
          {
            id: "10",
            component: <ChooseDoctor />,
            asMessage: true,
            trigger: "4",
            // end: true,
          },
          {
            id: "11",
            component: <RedirectToIntroduction />,
            asMessage: true,
            trigger: "4",
          },
        ]}
        floating={true}
        headerTitle="Trợ lý tư vấn khám bệnh"
      />
    </ThemeProvider>
  );
}

export default NewChatBot;
