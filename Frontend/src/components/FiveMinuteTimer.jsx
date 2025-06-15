import React, { useEffect, useState } from "react";

const FiveMinuteTimer = () => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Start the timer when button is clicked
  const startTimer = () => {
    if (!isRunning) {
      setSecondsLeft(5 * 60);
      setIsRunning(true);
    }
  };

  useEffect(() => {
    let timer;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex items-center justify-center h-12 text-white font-mono">
      <div>{formatTime(secondsLeft)}</div>
    </div>
  );
};

export default FiveMinuteTimer;
