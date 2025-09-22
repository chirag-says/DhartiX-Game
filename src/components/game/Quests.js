import React, { useState, useEffect } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import ProgressBar from "../common/ProgressBar";
import { getQuests, completeQuest } from "../../services/apiService";
import "./Quests.css";

const Quests = () => {
  const [quests, setQuests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("daily");

  useEffect(() => {
    const fetchQuests = async () => {
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
  }, []);

  const handleCompleteQuest = async (questId) => {
    try {
      const result = await completeQuest(questId);
      console.log("Quest completed:", result);
      // Update quest status in UI
      if (quests) {
        const updatedQuests = { ...quests };
        // Find and update the quest
        Object.keys(updatedQuests).forEach((category) => {
          const questIndex = updatedQuests[category].findIndex(
            (q) => q.id === questId
          );
          if (questIndex !== -1) {
            updatedQuests[category][questIndex].completed = true;
          }
        });
        setQuests(updatedQuests);
      }
    } catch (error) {
      console.error("Error completing quest:", error);
    }
  };

  const renderQuestItem = (quest) => (
    <div
      key={quest.id}
      className={`quest-item ${quest.completed ? "completed" : ""}`}
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
        {!quest.completed && (
          <Button
            variant="primary"
            size="small"
            onClick={() => handleCompleteQuest(quest.id)}
            disabled={quest.progress.current < quest.progress.target}
          >
            Complete
          </Button>
        )}
      </div>
    </div>
  );

  if (loading) return <div>Loading quests...</div>;
  if (!quests) return <div>No quests available</div>;

  return (
    <Card className="quests-widget">
      <div className="card-header">
        <h2 className="card-title">Quests</h2>
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
