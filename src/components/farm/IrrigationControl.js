import React, { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import ProgressBar from "../common/ProgressBar";
import "./IrrigationControl.css";

const IrrigationControl = () => {
  const [irrigationLevel, setIrrigationLevel] = useState(65);
  const [isIrrigating, setIsIrrigating] = useState(false);

  const fields = [
    { id: "field_a", name: "Field A", moisture: 60, target: 70 },
    { id: "field_b", name: "Field B", moisture: 65, target: 70 },
    { id: "field_c", name: "Field C", moisture: 70, target: 70 },
  ];

  const handleIrrigate = () => {
    setIsIrrigating(true);
    // Simulate irrigation process
    setTimeout(() => {
      setIsIrrigating(false);
      setIrrigationLevel(70);
    }, 3000);
  };

  const handleLevelChange = (e) => {
    setIrrigationLevel(parseInt(e.target.value));
  };

  return (
    <Card className="irrigation-control">
      <div className="card-header">
        <h2 className="card-title">Irrigation Control</h2>
        <div className="irrigation-status">
          <span
            className={`status-indicator ${
              isIrrigating ? "active" : "inactive"
            }`}
          ></span>
          <span className="status-text">
            {isIrrigating ? "Irrigating..." : "Idle"}
          </span>
        </div>
      </div>

      <div className="irrigation-overview">
        <div className="water-level">
          <div
            className="level-indicator"
            style={{ height: `${irrigationLevel}%` }}
          ></div>
        </div>
        <div className="level-info">
          <span className="level-value">{irrigationLevel}%</span>
          <span className="level-label">Water Level</span>
        </div>
      </div>

      <div className="irrigation-settings">
        <div className="setting-item">
          <label className="setting-label">Target Moisture Level</label>
          <div className="setting-control">
            <input
              type="range"
              min="40"
              max="90"
              value={irrigationLevel}
              onChange={handleLevelChange}
              disabled={isIrrigating}
            />
            <span className="setting-value">{irrigationLevel}%</span>
          </div>
        </div>

        <div className="setting-item">
          <label className="setting-label">Irrigation Duration</label>
          <div className="setting-control">
            <select disabled={isIrrigating}>
              <option>15 minutes</option>
              <option selected>30 minutes</option>
              <option>45 minutes</option>
              <option>60 minutes</option>
            </select>
          </div>
        </div>
      </div>

      <div className="field-moisture">
        <h3 className="section-title">Field Moisture Levels</h3>
        {fields.map((field) => (
          <div key={field.id} className="field-item">
            <div className="field-name">{field.name}</div>
            <div className="field-progress">
              <ProgressBar value={field.moisture} color="primary" height={8} />
              <span className="field-value">{field.moisture}%</span>
            </div>
            <div className="field-target">Target: {field.target}%</div>
          </div>
        ))}
      </div>

      <div className="irrigation-actions">
        <Button
          variant="primary"
          fullWidth
          onClick={handleIrrigate}
          disabled={isIrrigating}
        >
          {isIrrigating ? "Irrigating..." : "Start Irrigation"}
        </Button>
        <Button variant="outline" fullWidth>
          Schedule Irrigation
        </Button>
      </div>
    </Card>
  );
};

export default IrrigationControl;
