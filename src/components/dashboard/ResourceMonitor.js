import React, { useState, useEffect } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import ProgressBar from "../common/ProgressBar";
import Modal from "../common/Modal";
import Notification from "../common/Notification";
import "./ResourceMonitor.css";

const ResourceMonitor = () => {
  const [resources, setResources] = useState({
    water: { current: 1200, max: 2000, unit: "L" },
    fertilizer: { current: 45, max: 100, unit: "kg" },
    seeds: { current: 120, max: 200, unit: "packs" },
    energy: { current: 75, max: 100, unit: "%" },
  });

  const [showDetails, setShowDetails] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    title: "",
    message: "",
  });

  const getResourceStatus = (resource) => {
    const percentage = (resource.current / resource.max) * 100;
    if (percentage < 20) return { status: "Critical", color: "error" };
    if (percentage < 50) return { status: "Low", color: "warning" };
    if (percentage < 80) return { status: "Good", color: "primary" };
    return { status: "Excellent", color: "success" };
  };

  const handleRefill = (resourceType) => {
    setResources((prev) => ({
      ...prev,
      [resourceType]: {
        ...prev[resourceType],
        current: prev[resourceType].max,
      },
    }));

    setNotification({
      type: "success",
      title: "Resource Refilled",
      message: `${
        resourceType.charAt(0).toUpperCase() + resourceType.slice(1)
      } has been refilled to maximum capacity.`,
    });
    setShowNotification(true);
  };

  const renderResourceItem = (key, resource) => {
    const status = getResourceStatus(resource);
    const percentage = (resource.current / resource.max) * 100;

    return (
      <div key={key} className="resource-item">
        <div className="resource-header">
          <div className="resource-info">
            <h3 className="resource-name">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </h3>
            <div className="resource-status">
              <span
                className={`status-indicator status-indicator--${status.color}`}
              ></span>
              <span className="status-text">{status.status}</span>
            </div>
          </div>
          <div className="resource-values">
            <span className="current-value">{resource.current}</span>
            <span className="divider">/</span>
            <span className="max-value">{resource.max}</span>
            <span className="unit">{resource.unit}</span>
          </div>
        </div>

        <div className="resource-progress">
          <ProgressBar value={percentage} color={status.color} />
        </div>

        <div className="resource-actions">
          <Button
            variant="outline"
            size="small"
            onClick={() => handleRefill(key)}
          >
            Refill
          </Button>
          <Button
            variant="outline"
            size="small"
            onClick={() => setShowDetails(true)}
          >
            Details
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card className="resource-monitor">
        <div className="card-header">
          <h2 className="card-title">Resource Monitor</h2>
          <div className="monitor-actions">
            <Button
              variant="outline"
              size="small"
              onClick={() => setShowDetails(true)}
            >
              View All
            </Button>
          </div>
        </div>

        <div className="resource-grid">
          {Object.entries(resources).map(([key, resource]) =>
            renderResourceItem(key, resource)
          )}
        </div>

        <div className="resource-summary">
          <div className="summary-item">
            <span className="summary-label">Overall Status</span>
            <span className="summary-value">Good</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Efficiency</span>
            <span className="summary-value">78%</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Last Updated</span>
            <span className="summary-value">2 min ago</span>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Resource Details"
        size="large"
      >
        <div className="resource-details">
          <h3>Resource Usage History</h3>
          <div className="usage-chart">
            <div className="chart-placeholder">
              <p>Resource usage chart would be displayed here</p>
              <p>Showing trends for the last 7 days</p>
            </div>
          </div>

          <h3>Resource Allocation</h3>
          <div className="allocation-grid">
            {Object.entries(resources).map(([key, resource]) => (
              <div key={key} className="allocation-item">
                <div className="allocation-header">
                  <span className="allocation-name">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <span className="allocation-percentage">
                    {Math.round((resource.current / resource.max) * 100)}%
                  </span>
                </div>
                <ProgressBar
                  value={(resource.current / resource.max) * 100}
                  color="primary"
                />
                <div className="allocation-details">
                  <span>
                    Used: {resource.max - resource.current} {resource.unit}
                  </span>
                  <span>
                    Available: {resource.current} {resource.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <h3>Resource Recommendations</h3>
          <div className="recommendations">
            <div className="recommendation-item">
              <span className="recommendation-icon">💧</span>
              <div className="recommendation-content">
                <h4>Water Conservation</h4>
                <p>
                  Consider installing drip irrigation to reduce water usage by
                  30%
                </p>
              </div>
            </div>
            <div className="recommendation-item">
              <span className="recommendation-icon">🌱</span>
              <div className="recommendation-content">
                <h4>Organic Fertilizers</h4>
                <p>
                  Switch to organic fertilizers to improve soil health and
                  sustainability
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="primary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </div>
      </Modal>

      {showNotification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setShowNotification(false)}
        />
      )}
    </>
  );
};

export default ResourceMonitor;
