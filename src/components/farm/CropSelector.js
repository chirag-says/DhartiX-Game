import React, { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import "./CropSelector.css";

const CropSelector = () => {
  const [selectedCrop, setSelectedCrop] = useState(null);

  const crops = [
    {
      id: "rice",
      name: "Rice",
      season: "Kharif",
      waterNeed: "High",
      growthTime: "120 days",
      sustainability: 3,
      icon: "🌾",
    },
    {
      id: "tomato",
      name: "Tomato",
      season: "Rabi",
      waterNeed: "Medium",
      growthTime: "90 days",
      sustainability: 4,
      icon: "🍅",
    },
    {
      id: "spinach",
      name: "Spinach",
      season: "Zaid",
      waterNeed: "Medium",
      growthTime: "45 days",
      sustainability: 4,
      icon: "🥬",
    },
    {
      id: "wheat",
      name: "Wheat",
      season: "Rabi",
      waterNeed: "Medium",
      growthTime: "140 days",
      sustainability: 3,
      icon: "🌾",
    },
    {
      id: "corn",
      name: "Corn",
      season: "Kharif",
      waterNeed: "High",
      growthTime: "100 days",
      sustainability: 2,
      icon: "🌽",
    },
  ];

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
  };

  return (
    <Card className="crop-selector">
      <div className="card-header">
        <h2 className="card-title">Crop Selector</h2>
      </div>

      <div className="crop-filters">
        <Button variant="outline" size="small">
          All Seasons
        </Button>
        <Button variant="outline" size="small">
          Kharif
        </Button>
        <Button variant="outline" size="small">
          Rabi
        </Button>
        <Button variant="outline" size="small">
          Zaid
        </Button>
      </div>

      <div className="crop-list">
        {crops.map((crop) => (
          <div
            key={crop.id}
            className={`crop-item ${
              selectedCrop?.id === crop.id ? "selected" : ""
            }`}
            onClick={() => handleCropSelect(crop)}
          >
            <div className="crop-icon">{crop.icon}</div>
            <div className="crop-info">
              <h3 className="crop-name">{crop.name}</h3>
              <div className="crop-details">
                <span className="crop-season">{crop.season}</span>
                <span className="crop-water">💧 {crop.waterNeed}</span>
                <span className="crop-time">⏱️ {crop.growthTime}</span>
              </div>
              <div className="crop-sustainability">
                <span className="sustainability-label">Sustainability:</span>
                <div className="sustainability-rating">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`star ${
                        i < crop.sustainability ? "filled" : ""
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCrop && (
        <div className="crop-actions">
          <Button variant="primary" fullWidth>
            Plant {selectedCrop.name}
          </Button>
          <Button variant="outline" fullWidth>
            View Details
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CropSelector;
