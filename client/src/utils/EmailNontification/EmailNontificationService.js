import axios from "../../config/axios.customize";
const sendEmail = (recipientEmail, message) => {
  return axios.post(`/api/email/send-email`, recipientEmail, message);
};
const sendCancellationReason = async (data) => {
    return axios.post(`/api/email/send-cancellation-reason`, data);
  };
export { sendEmail, sendCancellationReason };
