import React, { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import "./FieldPlanner.css";

const FieldPlanner = () => {
  const [selectedField, setSelectedField] = useState(null);

  const fields = [
    {
      id: "field_a",
      name: "Field A",
      size: "1.2 acres",
      crop: "Rice",
      health: 85,
    },
    {
      id: "field_b",
      name: "Field B",
      size: "0.8 acres",
      crop: "Tomatoes",
      health: 92,
    },
    {
      id: "field_c",
      name: "Field C",
      size: "0.5 acres",
      crop: "Spinach",
      health: 78,
    },
  ];

  const handleFieldClick = (field) => {
    setSelectedField(field);
  };

  return (
    <Card className="field-planner">
      <div className="card-header">
        <h2 className="card-title">Field Planner</h2>
      </div>

      <div className="field-map">
        <div className="map-container">
          {fields.map((field) => (
            <div
              key={field.id}
              className={`field ${
                selectedField?.id === field.id ? "selected" : ""
              }`}
              onClick={() => handleFieldClick(field)}
            >
              <div className="field-name">{field.name}</div>
              <div className="field-crop">{field.crop}</div>
              <div className="field-health">{field.health}%</div>
            </div>
          ))}
        </div>
      </div>

      {selectedField && (
        <div className="field-details">
          <h3 className="details-title">{selectedField.name} Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Size</span>
              <span className="detail-value">{selectedField.size}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Current Crop</span>
              <span className="detail-value">{selectedField.crop}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Health</span>
              <span className="detail-value">{selectedField.health}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Moisture</span>
              <span className="detail-value">65%</span>
            </div>
          </div>

          <div className="field-actions">
            <Button variant="primary">Irrigate</Button>
            <Button variant="secondary">Apply Fertilizer</Button>
            <Button variant="outline">Change Crop</Button>
          </div>
        </div>
      )}

      <div className="planner-actions">
        <Button variant="primary" fullWidth>
          Save Layout
        </Button>
        <Button variant="outline" fullWidth>
          Reset
        </Button>
      </div>
    </Card>
  );
};

export default FieldPlanner;
