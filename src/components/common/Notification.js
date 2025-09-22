import React, { useEffect, useState } from "react";
import "./Notification.css";

const Notification = ({
  id,
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
  className = "",
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose(id);
    }
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "!";
      case "info":
        return "i";
      default:
        return "i";
    }
  };

  return (
    <div className={`notification notification--${type} ${className}`}>
      <div className="notification-icon">{getIcon()}</div>
      <div className="notification-content">
        {title && <div className="notification-title">{title}</div>}
        {message && <div className="notification-message">{message}</div>}
      </div>
      <button className="notification-close" onClick={handleClose}>
        ×
      </button>
    </div>
  );
};

export default Notification;
