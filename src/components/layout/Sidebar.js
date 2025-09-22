import React from "react";
import Button from "../common/Button";
import "./Sidebar.css";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "farm", label: "Farm Management", icon: "🌱" },
    { id: "game", label: "Green-Twin Game", icon: "🎮" },
    { id: "social", label: "Community", icon: "👥" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "primary" : "outline"}
              fullWidth
              className={`sidebar-item ${
                activeTab === item.id ? "active" : ""
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-label">Level</span>
              <span className="stat-value">3</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Points</span>
              <span className="stat-value">1,250</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
