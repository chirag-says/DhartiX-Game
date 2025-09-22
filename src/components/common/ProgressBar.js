import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ value, color = "primary", height = 8 }) => {
  const getColorClass = () => {
    switch (color) {
      case "primary":
        return "progress-bar--primary";
      case "success":
        return "progress-bar--success";
      case "warning":
        return "progress-bar--warning";
      case "error":
        return "progress-bar--error";
      default:
        return "progress-bar--primary";
    }
  };

  return (
    <div className="progress-bar" style={{ height: `${height}px` }}>
      <div
        className={`progress-bar-fill ${getColorClass()}`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
