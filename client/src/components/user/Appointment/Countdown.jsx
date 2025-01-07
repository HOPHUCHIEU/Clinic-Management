import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Countdown = ({ targetDate, onCountdownEnd, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    return Math.max(targetDate - now, 0); // Đảm bảo không âm
  });

  const requestRef = useRef(null);

  const updateCountdown = () => {
    const now = new Date();
    const remainingTime = Math.max(targetDate - now, 0);
    setTimeLeft(remainingTime);

    if (remainingTime <= 0) {
      onCountdownEnd();
      cancelAnimationFrame(requestRef.current);
    } else {
      requestRef.current = requestAnimationFrame(updateCountdown);
    }
  };

  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(updateCountdown);
    }
    return () => cancelAnimationFrame(requestRef.current); // Hủy khi component unmount
  }, [isActive]);

  const formatTimeLeft = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
  };

  if (!isActive) return null; // Không hiển thị countdown nếu không hoạt động

  return <span>{formatTimeLeft(timeLeft)}</span>;
};

Countdown.propTypes = {
  targetDate: PropTypes.instanceOf(Date).isRequired,
  onCountdownEnd: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default Countdown;
