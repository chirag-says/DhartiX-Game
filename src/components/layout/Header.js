import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img
            src="/assets/images/logo.png"
            alt="Green-Twin Logo"
            className="logo-img"
          />
          <h1 className="logo-text">Green-Twin</h1>
        </div>
        <div className="header-actions">
          <div className="user-profile">
            <div className="user-avatar">F</div>
            <span className="user-name">Farmer</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
