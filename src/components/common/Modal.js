import React from "react";
import Button from "./Button";
import "./Modal.css";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "medium",
  className = "",
  ...props
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={`modal ${className}`} onClick={handleBackdropClick}>
      <div className={`modal-content modal-content--${size}`}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">{children}</div>

        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
