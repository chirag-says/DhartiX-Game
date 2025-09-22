import React, { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import ProgressBar from "../common/ProgressBar";
import "./FertilizerControl.css";

const FertilizerControl = () => {
  const [selectedFertilizer, setSelectedFertilizer] = useState(null);
  const [applicationRate, setApplicationRate] = useState(50);

  const fertilizers = [
    {
      id: "organic_compost",
      name: "Organic Compost",
      type: "Organic",
      npk: "2-1-1",
      sustainability: 5,
      description: "Rich in organic matter, improves soil structure",
    },
    {
      id: "vermicompost",
      name: "Vermicompost",
      type: "Organic",
      npk: "3-1-2",
      sustainability: 5,
      description: "Nutrient-rich organic fertilizer from earthworms",
    },
    {
      id: "bone_meal",
      name: "Bone Meal",
      type: "Organic",
      npk: "3-15-0",
      sustainability: 4,
      description: "High in phosphorus, promotes root development",
    },
    {
      id: "chemical_npk",
      name: "NPK Fertilizer",
      type: "Chemical",
      npk: "10-10-10",
      sustainability: 2,
      description: "Balanced chemical fertilizer for quick results",
    },
  ];

  const fields = [
    { id: "field_a", name: "Field A", crop: "Rice", nutrients: 65 },
    { id: "field_b", name: "Field B", crop: "Tomatoes", nutrients: 78 },
    { id: "field_c", name: "Field C", crop: "Spinach", nutrients: 82 },
  ];

  const handleFertilizerSelect = (fertilizer) => {
    setSelectedFertilizer(fertilizer);
  };

  const handleApplyFertilizer = () => {
    if (selectedFertilizer) {
      alert(`Applying ${selectedFertilizer.name} at ${applicationRate}% rate`);
    }
  };

  const handleRateChange = (e) => {
    setApplicationRate(parseInt(e.target.value));
  };

  return (
    <Card className="fertilizer-control">
      <div className="card-header">
        <h2 className="card-title">Fertilizer Control</h2>
      </div>

      <div className="fertilizer-list">
        <h3 className="section-title">Available Fertilizers</h3>
        {fertilizers.map((fertilizer) => (
          <div
            key={fertilizer.id}
            className={`fertilizer-item ${
              selectedFertilizer?.id === fertilizer.id ? "selected" : ""
            }`}
            onClick={() => handleFertilizerSelect(fertilizer)}
          >
            <div className="fertilizer-info">
              <div className="fertilizer-header">
                <h3 className="fertilizer-name">{fertilizer.name}</h3>
                <span
                  className={`fertilizer-type ${fertilizer.type.toLowerCase()}`}
                >
                  {fertilizer.type}
                </span>
              </div>
              <p className="fertilizer-description">{fertilizer.description}</p>
              <div className="fertilizer-details">
                <span className="npk">NPK: {fertilizer.npk}</span>
                <div className="sustainability">
                  <span className="sustainability-label">Sustainability:</span>
                  <div className="sustainability-rating">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`star ${
                          i < fertilizer.sustainability ? "filled" : ""
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedFertilizer && (
        <div className="application-settings">
          <h3 className="section-title">Application Settings</h3>
          <div className="setting-item">
            <label className="setting-label">Application Rate</label>
            <div className="setting-control">
              <input
                type="range"
                min="10"
                max="100"
                value={applicationRate}
                onChange={handleRateChange}
              />
              <span className="setting-value">{applicationRate}%</span>
            </div>
          </div>

          <div className="field-selection">
            <label className="setting-label">Select Fields</label>
            <div className="field-options">
              {fields.map((field) => (
                <label key={field.id} className="field-option">
                  <input type="checkbox" defaultChecked />
                  <span>
                    {field.name} ({field.crop})
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="nutrient-levels">
        <h3 className="section-title">Current Nutrient Levels</h3>
        {fields.map((field) => (
          <div key={field.id} className="field-item">
            <div className="field-name">
              {field.name} ({field.crop})
            </div>
            <div className="field-progress">
              <ProgressBar value={field.nutrients} color="primary" height={8} />
              <span className="field-value">{field.nutrients}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="fertilizer-actions">
        <Button
          variant="primary"
          fullWidth
          onClick={handleApplyFertilizer}
          disabled={!selectedFertilizer}
        >
          Apply Fertilizer
        </Button>
        <Button variant="outline" fullWidth>
          Schedule Application
        </Button>
      </div>
    </Card>
  );
};

export default FertilizerControl;
