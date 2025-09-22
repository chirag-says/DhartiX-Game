import React, { useState, useEffect } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import ProgressBar from "../common/ProgressBar";
import { getQuests } from "../../services/apiService";
import "./Achievements.css";

const Achievements = () => {
  const [achievements, setAchievements] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await getQuests();
        setAchievements(data.achievements);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) return <div>Loading achievements...</div>;
  if (!achievements) return <div>No achievements available</div>;

  const earnedCount = achievements.filter((a) => a.completed).length;
  const totalCount = achievements.length;

  return (
    <Card className="achievements-widget">
      <div className="card-header">
        <h2 className="card-title">Achievements</h2>
        <div className="achievement-stats">
          <span className="earned-count">{earnedCount}</span>
          <span className="total-count">/{totalCount}</span>
        </div>
      </div>

      <div className="achievement-progress">
        <div className="progress-label">
          <span>Completion</span>
          <span>{Math.round((earnedCount / totalCount) * 100)}%</span>
        </div>
        <ProgressBar value={(earnedCount / totalCount) * 100} color="success" />
      </div>

      <div className="achievement-list">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-item ${
              achievement.completed ? "earned" : ""
            }`}
          >
            <div className="achievement-icon">
              {achievement.completed ? "🏆" : "🔒"}
            </div>
            <div className="achievement-info">
              <h3 className="achievement-title">{achievement.title}</h3>
              <p className="achievement-description">
                {achievement.description}
              </p>

              <div className="achievement-progress">
                <div className="progress-label">
                  <span>Progress</span>
                  <span>
                    {achievement.progress.current}/{achievement.progress.target}
                  </span>
                </div>
                <ProgressBar
                  value={
                    (achievement.progress.current /
                      achievement.progress.target) *
                    100
                  }
                  color={achievement.completed ? "success" : "primary"}
                  height={6}
                />
              </div>

              <div className="achievement-rewards">
                <span className="reward-icon">🪙</span>
                <span className="reward-value">
                  {achievement.rewards.coins}
                </span>
                <span className="reward-icon">⭐</span>
                <span className="reward-value">
                  {achievement.rewards.experience} XP
                </span>
                {achievement.rewards.gems && (
                  <>
                    <span className="reward-icon">💎</span>
                    <span className="reward-value">
                      {achievement.rewards.gems} Gems
                    </span>
                  </>
                )}
              </div>

              {achievement.completed && achievement.earnedDate && (
                <div className="earned-date">
                  Earned on{" "}
                  {new Date(achievement.earnedDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Achievements;
