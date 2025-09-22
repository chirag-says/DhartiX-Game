import React, { useState, useEffect } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { getCoops, joinCoop } from "../../services/apiService";
import "./CoopManagement.css";

const CoopManagement = () => {
  const [coops, setCoops] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my-coop");

  useEffect(() => {
    const fetchCoops = async () => {
      try {
        const data = await getCoops();
        setCoops(data);
      } catch (error) {
        console.error("Error fetching coops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoops();
  }, []);

  const handleJoinCoop = async (coopId) => {
    try {
      const result = await joinCoop(coopId);
      console.log("Joined coop:", result);
      // Update UI to show user is now in the coop
    } catch (error) {
      console.error("Error joining coop:", error);
    }
  };

  if (loading) return <div>Loading cooperative data...</div>;
  if (!coops) return <div>No cooperative data available</div>;

  return (
    <Card className="coop-management">
      <div className="card-header">
        <h2 className="card-title">Cooperative Management</h2>
      </div>

      <div className="coop-tabs">
        <Button
          variant={activeTab === "my-coop" ? "primary" : "outline"}
          size="small"
          onClick={() => setActiveTab("my-coop")}
        >
          My Co-op
        </Button>
        <Button
          variant={activeTab === "available" ? "primary" : "outline"}
          size="small"
          onClick={() => setActiveTab("available")}
        >
          Available Co-ops
        </Button>
      </div>

      {activeTab === "my-coop" && (
        <div className="my-coop">
          <div className="coop-header">
            <div className="coop-info">
              <h3 className="coop-name">{coops.playerCoop.name}</h3>
              <p className="coop-description">{coops.playerCoop.description}</p>
            </div>
            <div className="coop-stats">
              <div className="stat-item">
                <span className="stat-label">Level</span>
                <span className="stat-value">{coops.playerCoop.level}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Members</span>
                <span className="stat-value">
                  {coops.playerCoop.members}/{coops.playerCoop.maxMembers}
                </span>
              </div>
            </div>
          </div>

          <div className="coop-resources">
            <h3 className="section-title">Co-op Resources</h3>
            <div className="resource-grid">
              <div className="resource-item">
                <span className="resource-icon">🪙</span>
                <span className="resource-value">
                  {coops.playerCoop.resources.coins}
                </span>
                <span className="resource-label">Coins</span>
              </div>
              <div className="resource-item">
                <span className="resource-icon">🌱</span>
                <span className="resource-value">
                  {coops.playerCoop.resources.seeds.tomato}
                </span>
                <span className="resource-label">Tomato Seeds</span>
              </div>
              <div className="resource-item">
                <span className="resource-icon">🌾</span>
                <span className="resource-value">
                  {coops.playerCoop.resources.seeds.rice}
                </span>
                <span className="resource-label">Rice Seeds</span>
              </div>
              <div className="resource-item">
                <span className="resource-icon">🚜</span>
                <span className="resource-value">
                  {coops.playerCoop.resources.tools.tractor}
                </span>
                <span className="resource-label">Tractors</span>
              </div>
            </div>
          </div>

          <div className="coop-challenges">
            <h3 className="section-title">Active Challenges</h3>
            {coops.playerCoop.challenges.map((challenge) => (
              <div key={challenge.id} className="challenge-item">
                <div className="challenge-info">
                  <h4 className="challenge-title">{challenge.title}</h4>
                  <p className="challenge-description">
                    {challenge.description}
                  </p>
                </div>
                <div className="challenge-progress">
                  <div className="progress-label">
                    <span>Progress</span>
                    <span>
                      {challenge.progress.current}/{challenge.progress.target}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          (challenge.progress.current /
                            challenge.progress.target) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="challenge-rewards">
                  <span className="reward-icon">🪙</span>
                  <span className="reward-value">
                    {challenge.rewards.coins}
                  </span>
                  <span className="reward-icon">⭐</span>
                  <span className="reward-value">
                    {challenge.rewards.experience} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "available" && (
        <div className="available-coops">
          <h3 className="section-title">Join a Cooperative</h3>
          {coops.availableCoops.map((coop) => (
            <div key={coop.id} className="coop-card">
              <div className="coop-card-header">
                <h3 className="coop-name">{coop.name}</h3>
                <span className="coop-level">Level {coop.level}</span>
              </div>
              <p className="coop-description">{coop.description}</p>
              <div className="coop-meta">
                <span className="coop-members">
                  {coop.members}/{coop.maxMembers} members
                </span>
                <span className="coop-founded">
                  Founded: {new Date(coop.founded).toLocaleDateString()}
                </span>
              </div>
              <Button
                variant="primary"
                size="small"
                onClick={() => handleJoinCoop(coop.id)}
              >
                Join Co-op
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default CoopManagement;
