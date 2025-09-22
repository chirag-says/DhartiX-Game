import React, { useState, useEffect } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { getLeaderboard } from "../../services/apiService";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("weekly");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard(activeTab);
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeTab]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const renderLeaderboardItem = (item, index) => (
    <div
      key={index}
      className={`leaderboard-item ${
        item.name === "Green Farmer" ? "current-player" : ""
      }`}
    >
      <div className="rank">
        <span className="rank-icon">{getRankIcon(item.rank)}</span>
      </div>
      <div className="player-info">
        <div className="player-name">{item.name}</div>
        <div className="player-details">
          <span className="player-level">Level {item.level}</span>
          {item.coop && <span className="player-coop">{item.coop}</span>}
        </div>
      </div>
      <div className="score">
        <span className="score-value">{item.score}</span>
        <span className="score-label">points</span>
      </div>
    </div>
  );

  if (loading) return <div>Loading leaderboard...</div>;
  if (!leaderboard) return <div>No leaderboard data available</div>;

  return (
    <Card className="leaderboard-widget">
      <div className="card-header">
        <h2 className="card-title">Leaderboard</h2>
      </div>

      <div className="leaderboard-tabs">
        <Button
          variant={activeTab === "weekly" ? "primary" : "outline"}
          size="small"
          onClick={() => setActiveTab("weekly")}
        >
          Weekly
        </Button>
        <Button
          variant={activeTab === "sustainability" ? "primary" : "outline"}
          size="small"
          onClick={() => setActiveTab("sustainability")}
        >
          Sustainability
        </Button>
      </div>

      <div className="leaderboard-list">
        {leaderboard.slice(0, 10).map(renderLeaderboardItem)}
      </div>

      <div className="leaderboard-footer">
        <Button variant="outline" fullWidth>
          View Full Leaderboard
        </Button>
      </div>
    </Card>
  );
};

export default Leaderboard;
