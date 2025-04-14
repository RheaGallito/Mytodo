// TimeTracker.jsx
import { useState, useEffect } from "react";
import "../App.css";

function TimeTracker({ taskId, initialTime = 0 }) {
  const [timeSpent, setTimeSpent] = useState(initialTime);
  const [isTracking, setIsTracking] = useState(false);
  const [, setStartTime] = useState(null);

  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const toggleTracking = () => {
    if (isTracking) {
      setIsTracking(false);
      // Save to localStorage or API
      const trackedTasks = JSON.parse(localStorage.getItem('trackedTasks') || '{}');
      localStorage.setItem('trackedTasks', JSON.stringify({
        ...trackedTasks,
        [taskId]: (trackedTasks[taskId] || 0) + timeSpent
      }));
    } else {
      setStartTime(new Date());
      setIsTracking(true);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="time-tracker">
      <div className="time-display">{formatTime(timeSpent)}</div>
      <button 
        className={`track-btn ${isTracking ? "tracking" : ""}`}
        onClick={toggleTracking}
      >
        {isTracking ? "Stop Tracking" : "Start Tracking"}
      </button>
    </div>
  );
}

export default TimeTracker;