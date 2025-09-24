import React, { useState, useEffect } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import ProgressBar from "../common/ProgressBar";
import { getQuests, completeQuest } from "../../services/apiService";
import "./Quests.css";

// ✨ NEW: A simple refresh icon component
const RefreshIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10"></polyline>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
  </svg>
);

const Quests = () => {
  const [quests, setQuests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("daily");

  // ✨ CHANGE #1: Add a state variable to trigger refetching
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchQuests = async () => {
      setLoading(true); // Set loading to true on each fetch
      try {
        const data = await getQuests();
        setQuests(data);
      } catch (error) {
        console.error("Error fetching quests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();

    // ✨ CHANGE #2: Add refreshKey to the dependency array
    // This tells React to re-run this effect whenever refreshKey changes
  }, [refreshKey]);

  const handleCompleteQuest = async (questId) => {
    try {
      await completeQuest(questId);
      // After completing, trigger a refresh to show the "Claimed" state correctly
      setRefreshKey((oldKey) => oldKey + 1);
    } catch (error) {
      console.error("Error completing quest:", error);
    }
  };

  const renderQuestItem = (quest) => {
    const isCompletable = quest.progress.current >= quest.progress.target;
    return (
      <div
        key={quest.id}
        className={`quest-item ${quest.completed ? "completed" : ""} ${
          isCompletable && !quest.completed ? "completable" : ""
        }`}
      >
        <div className="quest-header">
          <div className="quest-info">
            <h3 className="quest-title">{quest.title}</h3>
            <p className="quest-description">{quest.description}</p>
          </div>
          <div className="quest-rewards">
            <span className="reward-icon">🪙</span>
            <span className="reward-value">{quest.rewards.coins}</span>
            <span className="reward-icon">⭐</span>
            <span className="reward-value">{quest.rewards.experience} XP</span>
          </div>
        </div>
        <div className="quest-progress">
          <div className="progress-label">
            <span>Progress</span>
            <span>
              {quest.progress.current}/{quest.progress.target}
            </span>
          </div>
          <ProgressBar
            value={(quest.progress.current / quest.progress.target) * 100}
            color={quest.completed ? "success" : "primary"}
          />
        </div>
        <div className="quest-footer">
          <div className="quest-meta">
            <span className="quest-difficulty">{quest.difficulty}</span>
            <span className="quest-type">{quest.type}</span>
          </div>
          {quest.completed ? (
            <Button variant="success" size="small" disabled>
              Claimed ✔️
            </Button>
          ) : (
            <Button
              variant="primary"
              size="small"
              onClick={() => handleCompleteQuest(quest.id)}
              disabled={!isCompletable}
            >
              Claim
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (loading && !quests) return <div>Loading quests...</div>;
  if (!quests) return <div>No quests available</div>;

  return (
    <Card className="quests-widget">
      <div className="card-header">
        <h2 className="card-title">Quests</h2>
        {/* ✨ CHANGE #3: Add the refresh button */}
        <Button
          variant="icon"
          size="small"
          onClick={() => setRefreshKey((oldKey) => oldKey + 1)}
          disabled={loading}
        >
          {loading ? "..." : <RefreshIcon />}
        </Button>
      </div>

      <div className="quest-tabs">
        <Button
          variant={activeTab === "daily" ? "primary" : "outline"}
          size="small"
          onClick={() => setActiveTab("daily")}
        >
          Daily
        </Button>
        <Button
          variant={activeTab === "weekly" ? "primary" : "outline"}
          size="small"
          onClick={() => setActiveTab("weekly")}
        >
          Weekly
        </Button>
        <Button
          variant={activeTab === "achievements" ? "primary" : "outline"}
          size="small"
          onClick={() => setActiveTab("achievements")}
        >
          Achievements
        </Button>
      </div>

      <div className="quest-list">
        {activeTab === "daily" && quests.daily.map(renderQuestItem)}
        {activeTab === "weekly" && quests.weekly.map(renderQuestItem)}
        {activeTab === "achievements" &&
          quests.achievements.map(renderQuestItem)}
      </div>
    </Card>
  );
};

export default Quests;
