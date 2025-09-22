import React from "react";
import Card from "../common/Card";
import ProgressBar from "../common/ProgressBar";
import Button from "../common/Button";
import "./CropHealthWidget.css";

const CropHealthWidget = ({ healthLevel }) => {
  const getHealthStatus = (level) => {
    if (level < 50) return { status: "Poor", color: "error" };
    if (level < 80) return { status: "Good", color: "warning" };
    return { status: "Excellent", color: "success" };
  };

  const healthStatus = getHealthStatus(healthLevel);

  const crops = [
    { name: "Rice", health: healthLevel, area: "Field A" },
    { name: "Tomatoes", health: healthLevel + 5, area: "Field B" },
    { name: "Spinach", health: healthLevel - 10, area: "Field C" },
  ];

  return (
    <Card className="crop-health-widget">
      <div className="card-header">
        <h2 className="card-title">Crop Health</h2>
        <div className="health-status">
          <span
            className={`status-indicator status-indicator--${healthStatus.color}`}
          ></span>
          <span className="status-text">{healthStatus.status}</span>
        </div>
      </div>

      <div className="health-overview">
        <div className="health-circle">
          <div
            className="circle-progress"
            style={{
              background: `conic-gradient(var(--primary) ${
                healthLevel * 3.6
              }deg, #e0e0e0 0deg)`,
            }}
          >
            <div className="circle-inner">
              <span className="health-value">{healthLevel}%</span>
              <span className="health-label">Overall</span>
            </div>
          </div>
        </div>
        <div className="health-stats">
          <div className="stat-item">
            <span className="stat-label">Healthy Crops</span>
            <span className="stat-value">2/3</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Issues Found</span>
            <span className="stat-value">1</span>
          </div>
        </div>
      </div>

      <div className="crop-list">
        <h3 className="crop-list-title">Crop Details</h3>
        {crops.map((crop, index) => (
          <div key={index} className="crop-item">
            <div className="crop-info">
              <span className="crop-name">{crop.name}</span>
              <span className="crop-area">{crop.area}</span>
            </div>
            <div className="crop-progress">
              <ProgressBar value={crop.health} color="primary" height={6} />
              <span className="crop-health-value">{crop.health}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="widget-actions">
        <Button variant="primary" fullWidth>
          Scan for Issues
        </Button>
        <Button variant="outline" fullWidth>
          Treatment Options
        </Button>
      </div>
    </Card>
  );
};

export default CropHealthWidget;
