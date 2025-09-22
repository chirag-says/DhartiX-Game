import React from "react";
import "./Button.css";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const buttonClass = `
    button
    button--${variant}
    button--${size}
    ${fullWidth ? "button--full-width" : ""}
    ${className}
  `;

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
