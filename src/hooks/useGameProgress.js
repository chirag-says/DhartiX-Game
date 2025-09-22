import { useState, useEffect } from "react";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  STORAGE_KEYS,
} from "../services/storageService";

export const useGameProgress = () => {
  const [playerData, setPlayerData] = useState(null);
  const [quests, setQuests] = useState(null);
  const [achievements, setAchievements] = useState(null);

  // Load game progress from local storage
  useEffect(() => {
    const gameProgress = loadFromLocalStorage(STORAGE_KEYS.GAME_PROGRESS);
    if (gameProgress) {
      setPlayerData(gameProgress.player);
      setQuests(gameProgress.quests);
      setAchievements(gameProgress.quests.achievements);
    }
  }, []);

  // Update player data
  const updatePlayerData = (newData) => {
    const updatedPlayerData = { ...playerData, ...newData };
    setPlayerData(updatedPlayerData);

    // Update in local storage
    const gameProgress = loadFromLocalStorage(STORAGE_KEYS.GAME_PROGRESS) || {};
    gameProgress.player = updatedPlayerData;
    saveToLocalStorage(STORAGE_KEYS.GAME_PROGRESS, gameProgress);
  };

  // Add experience to player
  const addExperience = (amount) => {
    if (!playerData) return;

    const newExperience = playerData.experience + amount;
    let newLevel = playerData.level;
    let experienceToNextLevel = playerData.experienceToNextLevel;

    // Check if player leveled up
    while (newExperience >= experienceToNextLevel) {
      newExperience -= experienceToNextLevel;
      newLevel++;
      experienceToNextLevel = newLevel * 1000; // Simple leveling formula
    }

    updatePlayerData({
      experience: newExperience,
      level: newLevel,
      experienceToNextLevel,
    });
  };

  // Add coins to player
  const addCoins = (amount) => {
    if (!playerData) return;
    updatePlayerData({
      coins: playerData.coins + amount,
    });
  };

  // Add gems to player
  const addGems = (amount) => {
    if (!playerData) return;
    updatePlayerData({
      gems: playerData.gems + amount,
    });
  };

  // Complete a quest
  const completeQuest = (questId) => {
    if (!quests) return;

    // Find and update the quest
    const updatedQuests = { ...quests };
    Object.keys(updatedQuests).forEach((category) => {
      const questIndex = updatedQuests[category].findIndex(
        (q) => q.id === questId
      );
      if (questIndex !== -1) {
        updatedQuests[category][questIndex].completed = true;

        // Add rewards
        const quest = updatedQuests[category][questIndex];
        if (quest.rewards.coins) addCoins(quest.rewards.coins);
        if (quest.rewards.experience) addExperience(quest.rewards.experience);
        if (quest.rewards.gems) addGems(quest.rewards.gems);
      }
    });

    setQuests(updatedQuests);

    // Update in local storage
    const gameProgress = loadFromLocalStorage(STORAGE_KEYS.GAME_PROGRESS) || {};
    gameProgress.quests = updatedQuests;
    saveToLocalStorage(STORAGE_KEYS.GAME_PROGRESS, gameProgress);
  };

  // Update quest progress
  const updateQuestProgress = (questId, progress) => {
    if (!quests) return;

    // Find and update the quest
    const updatedQuests = { ...quests };
    Object.keys(updatedQuests).forEach((category) => {
      const questIndex = updatedQuests[category].findIndex(
        (q) => q.id === questId
      );
      if (questIndex !== -1) {
        updatedQuests[category][questIndex].progress = progress;
      }
    });

    setQuests(updatedQuests);

    // Update in local storage
    const gameProgress = loadFromLocalStorage(STORAGE_KEYS.GAME_PROGRESS) || {};
    gameProgress.quests = updatedQuests;
    saveToLocalStorage(STORAGE_KEYS.GAME_PROGRESS, gameProgress);
  };

  return {
    playerData,
    quests,
    achievements,
    updatePlayerData,
    addExperience,
    addCoins,
    addGems,
    completeQuest,
    updateQuestProgress,
  };
};
