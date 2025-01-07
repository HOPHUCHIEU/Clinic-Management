// CountdownTimer.js
import React, { useState, useEffect } from "react";

const CountdownTimer = ({ targetDate, linkUrl }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const lessThanTwoHours = timeLeft.hours === 1 || (timeLeft.hours === 0 && timeLeft.minutes < 60);

  return (
    <div className="countdown-timer">
      {lessThanTwoHours ? (
        <a href={linkUrl} target="_blank" rel="noopener noreferrer">
          Click here to proceed to your appointment
        </a>
      ) : (
        <span>
          {timeLeft.days || timeLeft.hours || timeLeft.minutes || timeLeft.seconds
            ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
            : "Appointment time has arrived!"}
        </span>
      )}
    </div>
  );
};

export default CountdownTimer;

