import React from "react";
import Card from "../common/Card";
import ProgressBar from "../common/ProgressBar";
import Button from "../common/Button";
import "./SoilMoistureWidget.css";

const SoilMoistureWidget = ({ moistureLevel }) => {
  const getMoistureStatus = (level) => {
    if (level < 30) return { status: "Dry", color: "warning" };
    if (level < 60) return { status: "Optimal", color: "success" };
    return { status: "Wet", color: "primary" };
  };

  const moistureStatus = getMoistureStatus(moistureLevel);

  return (
    <Card className="soil-moisture-widget">
      <div className="card-header">
        <h2 className="card-title">Soil Moisture</h2>
        <div className="moisture-status">
          <span
            className={`status-indicator status-indicator--${moistureStatus.color}`}
          ></span>
          <span className="status-text">{moistureStatus.status}</span>
        </div>
      </div>

      <div className="moisture-visual">
        <div className="moisture-level">
          <div
            className="level-indicator"
            style={{ height: `${moistureLevel}%` }}
          ></div>
        </div>
        <div className="moisture-value">
          <span className="value">{moistureLevel}%</span>
          <span className="label">Moisture</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-item">
          <div className="progress-label">
            <span>Field A</span>
            <span>{moistureLevel - 5}%</span>
          </div>
          <ProgressBar value={moistureLevel - 5} color="primary" />
        </div>

        <div className="progress-item">
          <div className="progress-label">
            <span>Field B</span>
            <span>{moistureLevel}%</span>
          </div>
          <ProgressBar value={moistureLevel} color="primary" />
        </div>

        <div className="progress-item">
          <div className="progress-label">
            <span>Field C</span>
            <span>{moistureLevel + 3}%</span>
          </div>
          <ProgressBar value={moistureLevel + 3} color="primary" />
        </div>
      </div>

      <div className="widget-actions">
        <Button variant="primary" fullWidth>
          Irrigate Now
        </Button>
        <Button variant="outline" fullWidth>
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default SoilMoistureWidget;
