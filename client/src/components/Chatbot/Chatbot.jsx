
// import { useState } from 'react';
// import "../../style/Chatbot/Chatbot.scss";

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false); // Để theo dõi trạng thái mở/đóng của chatbot
//   const [messages, setMessages] = useState([
//     { sender: 'Sara', text: 'Hello! and welcome! What can I do for you?' },
//     { sender: 'Sara', text: 'Please write your question or choose one of the options below:' }
//   ]); // Các tin nhắn trong hộp thoại chat
//   const [inputValue, setInputValue] = useState(''); // Lưu trữ giá trị từ ô nhập liệu

//   // Hàm để xử lý việc gửi tin nhắn
//   const handleSendMessage = () => {
//     if (inputValue.trim() !== '') {
//       // Thêm tin nhắn mới của người dùng
//       setMessages([...messages, { sender: 'Visitor', text: inputValue }]);
//       setInputValue(''); // Reset lại ô nhập
//     }
//   };

//   // Hàm để theo dõi việc bấm Enter để gửi tin nhắn
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSendMessage();
//     }
//   };

//   return (
//     <div>
//       {/* Biểu tượng chatbot ở góc dưới bên phải */}
//       <div className='chatbot-icon' onClick={() => setIsOpen(!isOpen)}>
//       <img src='/src/assets/img/Img_chatbot/3.png' alt='Chatbot Icon' className='icon-img' />
//       </div>

//       {/* Cửa sổ chatbot */}
//       {isOpen && (
//         <div className='chatbot-window'>
//           <div className='chatbot-header'>
//             <h4>Chat With Us</h4>
//             <button onClick={() => setIsOpen(false)}>×</button>
//           </div>

//           <div className='chatbot-content'>
//             {messages.map((message, index) => (
//               <div className={`message ${message.sender === 'Visitor' ? 'you' : ''}`} key={index}>
//                 <strong>{message.sender}:</strong>
//                 <p>{message.text}</p>
//               </div>
//             ))}
//           </div>

//           <div className='chatbot-input'>
//             <input
//               type='text'
//               placeholder='Message...'
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyDown={handleKeyDown}
//             />
//             <button onClick={handleSendMessage}>
//             <img src='/src/assets/img/Img_chatbot/maybay3.png' alt='Chatbot Icon' className='icon-img' />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;
