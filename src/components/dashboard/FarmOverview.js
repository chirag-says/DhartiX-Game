import React from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import ProgressBar from "../common/ProgressBar";
import "./FarmOverview.css";

const FarmOverview = ({ farmData }) => {
  if (!farmData) return <div>Loading farm data...</div>;

  return (
    <Card className="farm-overview">
      <div className="card-header">
        <h2 className="card-title">Farm Overview</h2>
        <div className="farm-status">
          <span
            className={`status-indicator ${
              farmData.status === "healthy" ? "healthy" : "warning"
            }`}
          ></span>
          <span className="status-text">
            {farmData.status === "healthy" ? "Healthy" : "Needs Attention"}
          </span>
        </div>
      </div>

      <div className="farm-stats">
        <div className="stat-item">
          <span className="stat-label">Farm Size</span>
          <span className="stat-value">{farmData.size} acres</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Crops</span>
          <span className="stat-value">{farmData.crops}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Water Usage</span>
          <span className="stat-value">{farmData.waterUsage} L/day</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-item">
          <div className="progress-label">
            <span>Overall Health</span>
            <span>{farmData.overallHealth}%</span>
          </div>
          <ProgressBar value={farmData.overallHealth} color="success" />
        </div>

        <div className="progress-item">
          <div className="progress-label">
            <span>Sustainability Score</span>
            <span>{farmData.sustainabilityScore}/100</span>
          </div>
          <ProgressBar value={farmData.sustainabilityScore} color="primary" />
        </div>
      </div>

      <div className="farm-actions">
        <Button variant="primary" fullWidth>
          Irrigate Fields
        </Button>
        <Button variant="secondary" fullWidth>
          Apply Fertilizer
        </Button>
        <Button variant="outline" fullWidth>
          View Field Map
        </Button>
      </div>
    </Card>
  );
};

export default FarmOverview;
