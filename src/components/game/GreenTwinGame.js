import React, { useState, useEffect, useRef } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Notification from "../common/Notification";
import ProgressBar from "../common/ProgressBar";
import { Sparkles, Zap, Crown, Star, Trophy, Gift } from "lucide-react";
import "./GreenTwinGame.css";

const GreenTwinGame = () => {
  const [playerState, setPlayerState] = useState({
    greenCoins: 1250,
    ecoGems: 150,
    farmLevel: 1,
    experience: 0,
    experienceToNextLevel: 1000,
    inventory: [
      {
        name: "Wheat Seed",
        quantity: 10,
        emoji: "🌾",
        type: "seed",
        rarity: "common",
      },
      {
        name: "Carrot Seed",
        quantity: 5,
        emoji: "🥕",
        type: "seed",
        rarity: "common",
      },
      {
        name: "Tomato Seed",
        quantity: 8,
        emoji: "🍅",
        type: "seed",
        rarity: "uncommon",
      },
      {
        name: "Corn Seed",
        quantity: 2,
        emoji: "🌽",
        type: "seed",
        rarity: "rare",
      },
      {
        name: "Compost",
        quantity: 3,
        emoji: "💩",
        type: "fertilizer",
        rarity: "common",
      },
      {
        name: "Pesticide",
        quantity: 2,
        emoji: "🧪",
        type: "pesticide",
        rarity: "uncommon",
      },
    ],
    dailyRewardClaimed: false,
    achievements: [],
    farmName: "Emerald Valley Farm",
    totalHarvests: 0,
    streak: 0,
  });

  const [farmPlots, setFarmPlots] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      crop: null,
      status: "empty",
      health: 100,
      moisture: 50,
      nutrients: 50,
      pestLevel: 0,
      growthStage: 0,
      growthStartTime: null,
      lastWatered: null,
      lastFertilized: null,
      emoji: "",
      needsWater: false,
      hasPests: false,
      isReady: false,
      quality: "normal",
      boosted: false,
    }))
  );

  const [quests, setQuests] = useState([
    {
      id: 1,
      title: "First Steps",
      description: "Plant your first crop and begin your farming journey.",
      reward: { coins: 50, experience: 100 },
      status: "incomplete",
      progress: 0,
      target: 1,
      type: "tutorial",
      condition: () => farmPlots.some((p) => p.status !== "empty"),
    },
    {
      id: 2,
      title: "First Harvest",
      description: "Complete your first successful harvest.",
      reward: { coins: 75, gems: 5, experience: 150 },
      status: "incomplete",
      progress: 0,
      target: 1,
      type: "milestone",
      condition: (action) => action === "harvest",
    },
    {
      id: 3,
      title: "Hydration Master",
      description: "Water crops 10 times to master irrigation.",
      reward: { coins: 100, experience: 200 },
      status: "incomplete",
      progress: 0,
      target: 10,
      type: "skill",
      condition: (action) => action === "water",
    },
    {
      id: 4,
      title: "Market Trader",
      description: "Sell 5 crops at the marketplace.",
      reward: { coins: 200, experience: 300 },
      status: "incomplete",
      progress: 0,
      target: 5,
      type: "economy",
      condition: (action) => action === "sell",
    },
    {
      id: 5,
      title: "Organic Pioneer",
      description: "Achieve 5 organic harvests using sustainable methods.",
      reward: { coins: 300, gems: 10, experience: 500 },
      status: "incomplete",
      progress: 0,
      target: 5,
      type: "achievement",
      condition: (action) => action === "organic_harvest",
    },
  ]);

  const [weather, setWeather] = useState({
    condition: "sunny",
    temperature: 25,
    humidity: 60,
    forecast: [],
    severity: 1,
  });

  const [currentPlotId, setCurrentPlotId] = useState(null);
  const [selectedTool, setSelectedTool] = useState("hand");
  const [showPlotModal, setShowPlotModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);
  const [showMarketModal, setShowMarketModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    title: "",
    message: "",
  });
  const [marketPrices, setMarketPrices] = useState({});
  const [dayCount, setDayCount] = useState(1);
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [isLoading, setIsLoading] = useState(true);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [lastAction, setLastAction] = useState(null);

  const gameLoopRef = useRef(null);

  const cropData = {
    Wheat: {
      name: "Wheat",
      emoji: "🌾",
      seedName: "Wheat Seed",
      growthTime: 30,
      baseSellPrice: 3,
      waterNeed: "medium",
      seasons: ["spring", "autumn"],
      stages: ["🌱", "🌿", "🌾", "🌾"],
      description: "A versatile grain crop that thrives in moderate climates.",
      rarity: "common",
      xpReward: 50,
    },
    Carrots: {
      name: "Carrots",
      emoji: "🥕",
      seedName: "Carrot Seed",
      growthTime: 45,
      baseSellPrice: 5,
      waterNeed: "high",
      seasons: ["spring", "summer"],
      stages: ["🌱", "🥬", "🥕", "🥕"],
      description: "Nutritious root vegetables rich in vitamins and minerals.",
      rarity: "common",
      xpReward: 75,
    },
    Tomato: {
      name: "Tomato",
      emoji: "🍅",
      seedName: "Tomato Seed",
      growthTime: 60,
      baseSellPrice: 8,
      waterNeed: "high",
      seasons: ["summer"],
      stages: ["🌱", "🌿", "🍃", "🍅"],
      description: "Juicy fruits perfect for culinary applications.",
      rarity: "uncommon",
      xpReward: 100,
    },
    Corn: {
      name: "Corn",
      emoji: "🌽",
      seedName: "Corn Seed",
      growthTime: 90,
      baseSellPrice: 10,
      waterNeed: "high",
      seasons: ["summer"],
      stages: ["🌱", "🌿", "🌱", "🌽"],
      description: "Majestic cereal crop with exceptional market value.",
      rarity: "rare",
      xpReward: 150,
    },
    Strawberries: {
      name: "Strawberries",
      emoji: "🍓",
      seedName: "Strawberry Seed",
      growthTime: 75,
      baseSellPrice: 15,
      waterNeed: "high",
      seasons: ["spring"],
      stages: ["🌱", "🌿", "🌸", "🍓"],
      description: "Premium berries that command exceptional prices.",
      rarity: "epic",
      xpReward: 200,
    },
  };

  const marketBuyItems = [
    {
      name: "Wheat Seed",
      price: 10,
      emoji: "🌾",
      type: "seed",
      rarity: "common",
      description: "Hardy seeds for growing nutritious wheat crops.",
    },
    {
      name: "Carrot Seed",
      price: 20,
      emoji: "🥕",
      type: "seed",
      rarity: "common",
      description: "Premium seeds for vibrant carrot cultivation.",
    },
    {
      name: "Tomato Seed",
      price: 30,
      emoji: "🍅",
      type: "seed",
      rarity: "uncommon",
      description: "High-yield seeds for succulent tomatoes.",
    },
    {
      name: "Corn Seed",
      price: 40,
      emoji: "🌽",
      type: "seed",
      rarity: "rare",
      description: "Premium seeds for golden corn harvests.",
    },
    {
      name: "Strawberry Seed",
      price: 50,
      emoji: "🍓",
      type: "seed",
      rarity: "epic",
      description: "Exotic seeds for the finest strawberries.",
    },
    {
      name: "Organic Compost",
      price: 20,
      emoji: "💩",
      type: "fertilizer",
      rarity: "common",
      description: "Premium organic fertilizer for enhanced growth.",
    },
    {
      name: "Bio-Pesticide",
      price: 15,
      emoji: "🧪",
      type: "pesticide",
      rarity: "uncommon",
      description: "Eco-friendly pest control solution.",
    },
    {
      name: "Smart Irrigation",
      price: 200,
      emoji: "💧",
      type: "tool",
      rarity: "rare",
      description: "Automated watering system with AI optimization.",
    },
  ];

  const upgradeCosts = {
    2: { coins: 5000, gems: 100, experience: 1000 },
    3: { coins: 15000, gems: 250, experience: 2500 },
    4: { coins: 30000, gems: 500, experience: 5000 },
    5: { coins: 50000, gems: 1000, experience: 10000 },
  };

  const achievementsList = [
    {
      id: "first_plant",
      title: "Seedling Pioneer",
      description: "Plant your first crop and begin your farming legacy",
      icon: "🌱",
      unlocked: false,
      rarity: "common",
      reward: { coins: 50, experience: 25 },
    },
    {
      id: "first_harvest",
      title: "Harvest Hero",
      description: "Complete your first successful harvest",
      icon: "🌾",
      unlocked: false,
      rarity: "common",
      reward: { coins: 100, experience: 50 },
    },
    {
      id: "green_thumb",
      title: "Green Thumb Master",
      description: "Reach farming level 3 through dedication",
      icon: "👍",
      unlocked: false,
      rarity: "uncommon",
      reward: { coins: 200, gems: 5, experience: 100 },
    },
    {
      id: "millionaire",
      title: "Agricultural Tycoon",
      description: "Accumulate 10,000 Green Coins",
      icon: "💰",
      unlocked: false,
      rarity: "rare",
      reward: { coins: 500, gems: 10, experience: 200 },
    },
    {
      id: "organic_master",
      title: "Organic Virtuoso",
      description: "Achieve 10 consecutive organic harvests",
      icon: "🌿",
      unlocked: false,
      rarity: "epic",
      reward: { coins: 1000, gems: 25, experience: 500 },
    },
  ];

  // Initialize game with loading screen
  useEffect(() => {
    const initializeGame = async () => {
      setIsLoading(true);

      // Simulate loading time for dramatic effect
      await new Promise((resolve) => setTimeout(resolve, 2000));

      loadState();
      generateWeatherForecast();
      initializeMarketPrices();

      // Start game loop
      gameLoopRef.current = setInterval(() => {
        updateGameState();
      }, 2000);

      setIsLoading(false);
    };

    initializeGame();

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  // Save game state to localStorage
  const saveState = () => {
    const gameState = {
      playerState,
      farmPlots,
      quests,
      dayCount,
      timeOfDay,
      weather,
      marketPrices,
      achievements: playerState.achievements,
    };
    localStorage.setItem("greenTwinGameState", JSON.stringify(gameState));
  };

  // Load game state from localStorage
  const loadState = () => {
    const savedState = JSON.parse(localStorage.getItem("greenTwinGameState"));
    if (savedState) {
      setPlayerState(savedState.playerState);
      setFarmPlots(savedState.farmPlots);
      setQuests(savedState.quests);
      setDayCount(savedState.dayCount || 1);
      setTimeOfDay(savedState.timeOfDay || "morning");
      setWeather(savedState.weather);
      setMarketPrices(savedState.marketPrices || {});
    }
  };

  // Generate weather forecast
  const generateWeatherForecast = () => {
    const conditions = [
      { type: "sunny", severity: 1 },
      { type: "cloudy", severity: 1 },
      { type: "rainy", severity: 2 },
      { type: "stormy", severity: 3 },
    ];
    const forecast = [];

    for (let i = 0; i < 7; i++) {
      const weatherData =
        conditions[Math.floor(Math.random() * conditions.length)];
      forecast.push({
        day: i + 1,
        condition: weatherData.type,
        severity: weatherData.severity,
        temperature: Math.floor(Math.random() * 15) + 15,
        humidity: Math.floor(Math.random() * 40) + 40,
      });
    }

    setWeather((prev) => ({
      ...prev,
      forecast,
    }));
  };

  // Initialize market prices with dynamic fluctuations
  const initializeMarketPrices = () => {
    const prices = {};

    Object.keys(cropData).forEach((crop) => {
      const basePrice = cropData[crop].baseSellPrice;
      const fluctuation = 0.6 + Math.random() * 0.8; // 60% to 140% of base price
      prices[crop] = Math.floor(basePrice * fluctuation);
    });

    setMarketPrices(prices);
  };

  // Enhanced game loop with better mechanics
  const updateGameState = () => {
    // Update time progression
    setTimeOfDay((prev) => {
      if (prev === "morning") return "afternoon";
      if (prev === "afternoon") return "evening";
      return "morning";
    });

    // New day mechanics
    if (timeOfDay === "evening") {
      setDayCount((prev) => prev + 1);

      // Daily weather update
      const conditions = [
        { type: "sunny", severity: 1 },
        { type: "cloudy", severity: 1 },
        { type: "rainy", severity: 2 },
        { type: "stormy", severity: 3 },
      ];
      const newWeather =
        conditions[Math.floor(Math.random() * conditions.length)];

      setWeather((prev) => ({
        ...prev,
        condition: newWeather.type,
        severity: newWeather.severity,
        temperature: Math.floor(Math.random() * 15) + 15,
        humidity: Math.floor(Math.random() * 40) + 40,
      }));

      // Market price fluctuations
      initializeMarketPrices();

      // Reset daily rewards
      setPlayerState((prev) => ({ ...prev, dailyRewardClaimed: false }));
    }

    // Enhanced crop growth mechanics
    setFarmPlots((prevPlots) => {
      return prevPlots.map((plot) => {
        if (plot.status === "planted" && plot.growthStartTime) {
          const growthTime = cropData[plot.crop].growthTime * 1000;
          const growthPercentage =
            ((Date.now() - plot.growthStartTime) / growthTime) * 100;

          // Weather effects on growth
          let growthModifier = 1;
          if (weather.condition === "sunny") growthModifier = 1.1;
          if (weather.condition === "rainy") growthModifier = 1.05;
          if (weather.condition === "stormy") growthModifier = 0.9;

          const adjustedGrowthPercentage = growthPercentage * growthModifier;

          // Dynamic growth stages
          let newGrowthStage = 0;
          if (adjustedGrowthPercentage >= 25) newGrowthStage = 1;
          if (adjustedGrowthPercentage >= 50) newGrowthStage = 2;
          if (adjustedGrowthPercentage >= 75) newGrowthStage = 3;
          if (adjustedGrowthPercentage >= 100) newGrowthStage = 4;

          const cropInfo = cropData[plot.crop];
          const newEmoji =
            cropInfo.stages[
              Math.min(newGrowthStage, cropInfo.stages.length - 1)
            ];
          const isReady = adjustedGrowthPercentage >= 100;

          // Enhanced moisture system
          let newMoisture = plot.moisture;
          const moistureChange =
            weather.condition === "rainy"
              ? 15
              : weather.condition === "sunny"
              ? -8
              : weather.condition === "stormy"
              ? -5
              : -3;
          newMoisture = Math.max(
            0,
            Math.min(100, plot.moisture + moistureChange)
          );

          // Advanced pest mechanics
          let hasPests = plot.hasPests;
          const pestChance = weather.condition === "humid" ? 0.04 : 0.015;
          if (!hasPests && Math.random() < pestChance) {
            hasPests = true;
          }

          // Health calculation with multiple factors
          let newHealth = plot.health;
          if (newMoisture < 20) newHealth -= 4;
          if (newMoisture > 90) newHealth -= 2;
          if (hasPests) newHealth -= 6;
          if (plot.nutrients < 30) newHealth -= 3;
          if (weather.condition === "stormy") newHealth -= 2;

          // Boost effects
          if (plot.boosted) newHealth += 2;

          newHealth = Math.max(0, Math.min(100, newHealth));

          // Quality determination
          let quality = "normal";
          if (newHealth >= 90 && !hasPests && newMoisture > 50)
            quality = "premium";
          if (
            newHealth >= 95 &&
            !hasPests &&
            newMoisture > 70 &&
            plot.nutrients > 70
          )
            quality = "perfect";
          if (newHealth < 50 || hasPests) quality = "poor";

          return {
            ...plot,
            growthStage: newGrowthStage,
            emoji: newEmoji,
            moisture: newMoisture,
            needsWater: newMoisture < 25,
            hasPests,
            health: newHealth,
            isReady,
            quality,
          };
        }
        return plot;
      });
    });

    saveState();
  };

  // Enhanced notification system
  const showGameNotification = (message, type = "success", reward = null) => {
    const titles = {
      success: "🎉 Success!",
      error: "⚠️ Warning!",
      info: "ℹ️ Information",
      achievement: "🏆 Achievement!",
      levelup: "⭐ Level Up!",
      reward: "🎁 Reward!",
    };

    setNotification({
      type,
      title: titles[type] || "Notification",
      message,
      reward,
    });
    setShowNotification(true);
  };

  // Enhanced quest progress system
  const updateQuestProgress = (actionType, plot = null) => {
    setQuests((prevQuests) => {
      return prevQuests.map((quest) => {
        if (quest.status === "completed") return quest;

        let shouldUpdate = false;
        let newProgress = quest.progress;

        // Quest condition checking
        switch (quest.id) {
          case 1: // First Steps
            if (actionType === "plant" && quest.progress === 0) {
              shouldUpdate = true;
              newProgress = 1;
            }
            break;
          case 2: // First Harvest
            if (actionType === "harvest" && quest.progress === 0) {
              shouldUpdate = true;
              newProgress = 1;
            }
            break;
          case 3: // Hydration Master
            if (actionType === "water" && quest.progress < quest.target) {
              shouldUpdate = true;
              newProgress = quest.progress + 1;
            }
            break;
          case 4: // Market Trader
            if (actionType === "sell" && quest.progress < quest.target) {
              shouldUpdate = true;
              newProgress = quest.progress + 1;
            }
            break;
          case 5: // Organic Farmer
            if (
              actionType === "organic_harvest" &&
              quest.progress < quest.target
            ) {
              shouldUpdate = true;
              newProgress = quest.progress + 1;
            }
            break;
        }

        if (shouldUpdate) {
          if (newProgress >= quest.target) {
            showGameNotification(
              `Quest completed: ${quest.title}! Click to claim your reward.`,
              "achievement"
            );
            return { ...quest, status: "claimable", progress: newProgress };
          } else {
            return { ...quest, progress: newProgress };
          }
        }

        return quest;
      });
    });
  };

  // Enhanced reward claiming with animations
  const claimQuestReward = (questId) => {
    setQuests((prevQuests) => {
      return prevQuests.map((quest) => {
        if (quest.id === questId && quest.status === "claimable") {
          const newState = { ...playerState };
          newState.greenCoins += quest.reward.coins;
          newState.experience += quest.reward.experience;
          if (quest.reward.gems) newState.ecoGems += quest.reward.gems;

          // Level up check with enhanced feedback
          if (newState.experience >= newState.experienceToNextLevel) {
            newState.farmLevel += 1;
            newState.experience -= newState.experienceToNextLevel;
            newState.experienceToNextLevel = newState.farmLevel * 1000;
            showGameNotification(
              `🎊 Congratulations! You've reached Level ${newState.farmLevel}!`,
              "levelup"
            );
          }

          setPlayerState(newState);
          showGameNotification(
            `Quest Reward: ${quest.reward.coins}🪙 ${
              quest.reward.gems ? `${quest.reward.gems}💎` : ""
            } ${quest.reward.experience}⭐`,
            "reward",
            quest.reward
          );

          checkAchievements();
          return { ...quest, status: "completed" };
        }
        return quest;
      });
    });
    saveState();
  };

  // Enhanced achievement system
  const checkAchievements = () => {
    const newAchievements = [...playerState.achievements];

    achievementsList.forEach((achievement) => {
      if (newAchievements.includes(achievement.id)) return;

      let shouldUnlock = false;

      switch (achievement.id) {
        case "first_plant":
          shouldUnlock = farmPlots.some((p) => p.status !== "empty");
          break;
        case "first_harvest":
          shouldUnlock = playerState.totalHarvests > 0;
          break;
        case "green_thumb":
          shouldUnlock = playerState.farmLevel >= 3;
          break;
        case "millionaire":
          shouldUnlock = playerState.greenCoins >= 10000;
          break;
        case "organic_master":
          shouldUnlock = playerState.streak >= 10;
          break;
      }

      if (shouldUnlock) {
        newAchievements.push(achievement.id);
        showGameNotification(
          `🏆 Achievement Unlocked: ${achievement.title}!`,
          "achievement",
          achievement.reward
        );

        // Award achievement rewards
        setPlayerState((prev) => ({
          ...prev,
          greenCoins: prev.greenCoins + achievement.reward.coins,
          experience: prev.experience + achievement.reward.experience,
          ecoGems: prev.ecoGems + (achievement.reward.gems || 0),
        }));
      }
    });

    if (newAchievements.length > playerState.achievements.length) {
      setPlayerState((prev) => ({ ...prev, achievements: newAchievements }));
    }
  };

  // Enhanced daily reward system
  const claimDailyReward = () => {
    if (playerState.dailyRewardClaimed) {
      showGameNotification(
        "You've already claimed today's reward! Come back tomorrow.",
        "info"
      );
      return;
    }

    const baseReward = 100;
    const levelBonus = playerState.farmLevel * 25;
    const streakBonus = playerState.streak * 10;
    const totalReward = baseReward + levelBonus + streakBonus;

    setPlayerState((prev) => ({
      ...prev,
      dailyRewardClaimed: true,
      greenCoins: prev.greenCoins + totalReward,
      streak: prev.streak + 1,
    }));

    showGameNotification(
      `Daily Reward: ${totalReward}🪙 (Streak: ${playerState.streak + 1})`,
      "reward"
    );
    saveState();
  };

  // Enhanced plot information modal
  const showPlotInfo = (plotId) => {
    setCurrentPlotId(plotId);
    setShowPlotModal(true);
  };

  // Enhanced plot actions with better feedback
  const handlePlotAction = (action) => {
    if (!currentPlotId) return;

    setFarmPlots((prevPlots) => {
      return prevPlots.map((plot) => {
        if (plot.id === currentPlotId) {
          switch (action) {
            case "water":
              if (plot.moisture >= 90) {
                showGameNotification(
                  "This plot is already well-watered!",
                  "info"
                );
                return plot;
              }
              updateQuestProgress("water");
              showGameNotification("💧 Plot watered successfully!", "success");
              return {
                ...plot,
                moisture: Math.min(100, plot.moisture + 35),
                needsWater: false,
                lastWatered: Date.now(),
              };

            case "fertilize":
              if (plot.nutrients >= 90) {
                showGameNotification(
                  "This plot is already well-fertilized!",
                  "info"
                );
                return plot;
              }
              showGameNotification(
                "🌱 Fertilizer applied successfully!",
                "success"
              );
              return {
                ...plot,
                nutrients: Math.min(100, plot.nutrients + 40),
                boosted: true,
                lastFertilized: Date.now(),
              };

            case "pesticide":
              if (!plot.hasPests) {
                showGameNotification(
                  "This plot doesn't have any pests!",
                  "info"
                );
                return plot;
              }
              updateQuestProgress("pesticide");
              showGameNotification(
                "🧪 Pests eliminated successfully!",
                "success"
              );
              return {
                ...plot,
                hasPests: false,
                health: Math.min(100, plot.health + 10),
              };

            case "harvest":
              const cropInfo = cropData[plot.crop];
              if (cropInfo && plot.isReady) {
                const baseSellPrice =
                  marketPrices[plot.crop] || cropInfo.baseSellPrice;

                // Quality multiplier
                const qualityMultipliers = {
                  poor: 0.7,
                  normal: 1.0,
                  premium: 1.3,
                  perfect: 1.6,
                };
                const qualityMultiplier =
                  qualityMultipliers[plot.quality] || 1.0;

                // Combo multiplier
                const finalPrice = Math.floor(
                  baseSellPrice * qualityMultiplier * comboMultiplier
                );

                const newState = { ...playerState };
                newState.greenCoins += finalPrice;
                newState.experience += cropInfo.xpReward;
                newState.totalHarvests += 1;

                setPlayerState(newState);

                // Check if harvest was organic
                const isOrganic =
                  !plot.lastFertilized ||
                  plot.lastFertilized < Date.now() - 20000;
                if (isOrganic) {
                  updateQuestProgress("organic_harvest");
                  newState.streak += 1;
                }

                const qualityText =
                  plot.quality !== "normal"
                    ? ` (${plot.quality.toUpperCase()})`
                    : "";
                const comboText =
                  comboMultiplier > 1 ? ` x${comboMultiplier.toFixed(1)}` : "";

                showGameNotification(
                  `🌾 Harvested ${plot.crop}${qualityText}! +${finalPrice}🪙 +${cropInfo.xpReward}⭐${comboText}`,
                  "success"
                );

                updateQuestProgress("harvest");

                // Update combo multiplier
                if (lastAction === "harvest") {
                  setComboMultiplier((prev) => Math.min(3.0, prev + 0.1));
                } else {
                  setComboMultiplier(1.0);
                }
                setLastAction("harvest");

                // Reset plot
                return {
                  ...plot,
                  status: "empty",
                  crop: null,
                  emoji: "",
                  growthStage: 0,
                  growthStartTime: null,
                  isReady: false,
                  health: 100,
                  moisture: 50,
                  nutrients: 50,
                  quality: "normal",
                  boosted: false,
                };
              }
              return plot;
            default:
              return plot;
          }
        }
        return plot;
      });
    });

    setShowPlotModal(false);
    saveState();
  };

  // Enhanced planting system
  const plantCrop = (cropName) => {
    if (!currentPlotId) return;

    const cropInfo = cropData[cropName];
    const seedInventory = playerState.inventory.find(
      (item) => item.name === cropInfo.seedName
    );

    if (!seedInventory || seedInventory.quantity <= 0) {
      showGameNotification(
        `❌ You don't have any ${cropInfo.seedName}!`,
        "error"
      );
      return;
    }

    // Weather suitability check
    if (weather.condition === "stormy" && cropInfo.waterNeed === "low") {
      showGameNotification(
        `⛈️ ${cropName} doesn't thrive in stormy weather! Consider waiting.`,
        "error"
      );
      return;
    }

    // Update inventory
    setPlayerState((prev) => ({
      ...prev,
      inventory: prev.inventory.map((item) =>
        item.name === cropInfo.seedName
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    }));

    // Update plot
    setFarmPlots((prevPlots) =>
      prevPlots.map((plot) =>
        plot.id === currentPlotId
          ? {
              ...plot,
              crop: cropName,
              status: "planted",
              emoji: cropInfo.stages[0],
              growthStage: 0,
              growthStartTime: Date.now(),
              needsWater: false,
              hasPests: false,
              health: 100,
              quality: "normal",
            }
          : plot
      )
    );

    showGameNotification(`🌱 ${cropName} planted successfully!`, "success");
    updateQuestProgress("plant");
    setShowPlotModal(false);
    saveState();
  };

  // Enhanced market transactions
  const buyMarketItem = (itemName) => {
    const item = marketBuyItems.find((i) => i.name === itemName);
    if (!item) return;

    if (playerState.greenCoins < item.price) {
      showGameNotification("💰 Insufficient Green Coins!", "error");
      return;
    }

    setPlayerState((prev) => ({
      ...prev,
      greenCoins: prev.greenCoins - item.price,
    }));

    setPlayerState((prev) => {
      const existingItem = prev.inventory.find((i) => i.name === itemName);
      if (existingItem) {
        return {
          ...prev,
          inventory: prev.inventory.map((i) =>
            i.name === itemName ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      } else {
        const newItem = { ...item, quantity: 1 };
        return {
          ...prev,
          inventory: [...prev.inventory, newItem],
        };
      }
    });

    showGameNotification(`🛒 Purchased ${itemName}!`, "success");
    saveState();
  };

  const sellMarketItem = (itemName, price, quantity = 1) => {
    const inventoryItem = playerState.inventory.find(
      (i) => i.name === itemName
    );
    if (!inventoryItem || inventoryItem.quantity < quantity) {
      showGameNotification(`❌ Insufficient ${itemName} to sell!`, "error");
      return;
    }

    const totalPrice = price * quantity;

    setPlayerState((prev) => ({
      ...prev,
      greenCoins: prev.greenCoins + totalPrice,
      inventory: prev.inventory
        .map((item) =>
          item.name === itemName
            ? { ...item, quantity: item.quantity - quantity }
            : item
        )
        .filter((item) => item.quantity > 0),
    }));

    showGameNotification(
      `💰 Sold ${quantity}x ${itemName} for ${totalPrice}🪙!`,
      "success"
    );
    updateQuestProgress("sell");
    saveState();
  };

  // Enhanced upgrade system
  const upgradeFarmLevel = () => {
    const nextLevel = playerState.farmLevel + 1;
    const cost = upgradeCosts[nextLevel];

    if (!cost) {
      showGameNotification(
        "🏆 You've reached the maximum level! You're a true farming master!",
        "info"
      );
      return;
    }

    if (
      playerState.greenCoins < cost.coins ||
      playerState.ecoGems < cost.gems
    ) {
      showGameNotification("💎 Insufficient resources for upgrade!", "error");
      return;
    }

    setPlayerState((prev) => ({
      ...prev,
      farmLevel: nextLevel,
      greenCoins: prev.greenCoins - cost.coins,
      ecoGems: prev.ecoGems - cost.gems,
      experience: prev.experience + cost.experience,
    }));

    showGameNotification(
      `🎉 Farm upgraded to Level ${nextLevel}! New features unlocked!`,
      "levelup"
    );
    setShowUpgradeModal(false);
    saveState();
  };

  // Get current plot for modal
  const currentPlot = farmPlots.find((plot) => plot.id === currentPlotId);

  // Count claimable quests
  const claimableQuests = quests.filter((q) => q.status === "claimable").length;

  // Rarity colors
  const getRarityColor = (rarity) => {
    const colors = {
      common: "#9e9e9e",
      uncommon: "#4caf50",
      rare: "#2196f3",
      epic: "#9c27b0",
      legendary: "#ff9800",
    };
    return colors[rarity] || colors.common;
  };

  // Enhanced plot rendering with visual effects
  const renderPlot = (plot) => {
    const plotClasses = `
      farm-plot 
      ${plot.needsWater ? "needs-water" : ""} 
      ${plot.hasPests ? "has-pests" : ""} 
      ${plot.isReady ? "ready-to-harvest" : ""}
      ${plot.quality === "premium" ? "premium-crop" : ""}
      ${plot.quality === "perfect" ? "perfect-crop" : ""}
      ${plot.boosted ? "boosted" : ""}
    `.trim();

    return (
      <div
        key={plot.id}
        className={plotClasses}
        onClick={() => showPlotInfo(plot.id)}
        style={{
          animationDelay: `${plot.id * 0.1}s`,
        }}
      >
        <div className="plot-content">
          {plot.status === "empty" ? (
            <div className="plot-empty">
              <div className="plot-dirt"></div>
              <div className="plot-sparkles"></div>
            </div>
          ) : (
            <div className="plot-crop">
              <div className="crop-container">
                <div className="crop-emoji">{plot.emoji}</div>
                {plot.boosted && <div className="boost-effect">✨</div>}
                {plot.quality === "premium" && (
                  <div className="quality-indicator premium">⭐</div>
                )}
                {plot.quality === "perfect" && (
                  <div className="quality-indicator perfect">👑</div>
                )}
              </div>
              <div className="crop-progress">
                <ProgressBar
                  value={(plot.growthStage / 4) * 100}
                  color={
                    plot.health > 80
                      ? "success"
                      : plot.health > 50
                      ? "warning"
                      : "error"
                  }
                  height={4}
                  animated={plot.growthStage < 4}
                />
              </div>
              <div className="health-bar">
                <div
                  className="health-fill"
                  style={{
                    width: `${plot.health}%`,
                    backgroundColor:
                      plot.health > 70
                        ? "#4caf50"
                        : plot.health > 40
                        ? "#ff9800"
                        : "#f44336",
                  }}
                ></div>
              </div>
            </div>
          )}

          {plot.needsWater && <div className="status-indicator water">💧</div>}
          {plot.hasPests && <div className="status-indicator pest">🐛</div>}
          {plot.isReady && <div className="status-indicator harvest">⚡</div>}

          <div className="plot-id">{plot.id}</div>
        </div>
      </div>
    );
  };

  // Enhanced tool button rendering
  const renderToolButton = (tool, icon, label, color = "#4caf50") => (
    <button
      className={`tool-button ${selectedTool === tool ? "active" : ""}`}
      onClick={() => setSelectedTool(tool)}
      style={{ "--tool-color": color }}
    >
      <span className="tool-icon">{icon}</span>
      <span className="tool-label">{label}</span>
      {selectedTool === tool && <div className="tool-selection-ring"></div>}
    </button>
  );

  // Loading screen component
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="farm-logo">🌾</div>
          <h1 className="game-title">Green Twin Farm</h1>
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
          </div>
          <p className="loading-text">Preparing your farm...</p>
        </div>
        <div className="loading-particles"></div>
      </div>
    );
  }

  return (
    <div className="green-twin-game">
      {/* Enhanced Sky Background with Parallax */}
      <div className="sky-background">
        <div className="sun"></div>
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
        <div className="birds">
          <div className="bird"></div>
          <div className="bird"></div>
        </div>
      </div>

      {/* Enhanced Game Header */}
      <div className="game-header">
        <div className="player-section">
          <div className="player-avatar">
            <div className="avatar-ring"></div>
            <span>👨‍🌾</span>
            <div className="level-badge">{playerState.farmLevel}</div>
          </div>
          <div className="player-details">
            <h2 className="player-name">{playerState.farmName}</h2>
            <div className="experience-bar">
              <ProgressBar
                value={
                  (playerState.experience / playerState.experienceToNextLevel) *
                  100
                }
                height={8}
                color="warning"
                animated={true}
              />
              <span className="exp-text">
                {playerState.experience}/{playerState.experienceToNextLevel} XP
              </span>
            </div>
            <div className="player-stats">
              <div className="stat-card">
                <Crown size={16} />
                <span>Level {playerState.farmLevel}</span>
              </div>
              <div className="stat-card">
                <Trophy size={16} />
                <span>{playerState.totalHarvests} Harvests</span>
              </div>
            </div>
          </div>
        </div>

        <div className="game-status">
          <div className="time-weather-section">
            <div className="day-counter">
              <Star className="day-icon" />
              <div className="day-info">
                <span className="day-label">Day</span>
                <span className="day-value">{dayCount}</span>
              </div>
            </div>
            <div
              className="weather-display"
              onClick={() => setShowWeatherModal(true)}
            >
              <div className="weather-icon">
                {weather.condition === "sunny" && "☀️"}
                {weather.condition === "cloudy" && "☁️"}
                {weather.condition === "rainy" && "🌧️"}
                {weather.condition === "stormy" && "⛈️"}
              </div>
              <div className="weather-info">
                <span className="weather-temp">{weather.temperature}°C</span>
                <span className="weather-condition">
                  {weather.condition.charAt(0).toUpperCase() +
                    weather.condition.slice(1)}
                </span>
              </div>
            </div>
            <div className="time-display">
              <div className="time-icon">
                {timeOfDay === "morning" && "🌅"}
                {timeOfDay === "afternoon" && "☀️"}
                {timeOfDay === "evening" && "🌙"}
              </div>
              <span className="time-label">
                {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
              </span>
            </div>
          </div>

          {comboMultiplier > 1 && (
            <div className="combo-display">
              <Zap className="combo-icon" />
              <span>Combo x{comboMultiplier.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="resources-section">
          <div className="currency-display">
            <div className="currency-item coins">
              <span className="currency-icon">🪙</span>
              <span className="currency-value">
                {playerState.greenCoins.toLocaleString()}
              </span>
            </div>
            <div className="currency-item gems">
              <span className="currency-icon">💎</span>
              <span className="currency-value">
                {playerState.ecoGems.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="action-buttons">
            <Button
              variant="primary"
              onClick={() => setShowQuestsModal(true)}
              className={`quest-button ${
                claimableQuests > 0 ? "has-notification" : ""
              }`}
            >
              <Trophy size={16} />
              Quests
              {claimableQuests > 0 && (
                <span className="notification-badge">{claimableQuests}</span>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowMarketModal(true)}
              className="market-button"
            >
              <span>🏪</span>
              Market
            </Button>
            <Button
              variant="outline"
              onClick={claimDailyReward}
              disabled={playerState.dailyRewardClaimed}
              className={`daily-reward-button ${
                !playerState.dailyRewardClaimed ? "available" : ""
              }`}
            >
              <Gift size={16} />
              {playerState.dailyRewardClaimed ? "Claimed" : "Daily Reward"}
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Game Tools */}
      <div className="game-tools">
        <div className="tools-container">
          {renderToolButton("hand", "👆", "Select", "#6c757d")}
          {renderToolButton("water", "💧", "Water", "#2196f3")}
          {renderToolButton("fertilize", "🌱", "Fertilize", "#4caf50")}
          {renderToolButton("pesticide", "🧪", "Pesticide", "#ff5722")}
          {renderToolButton("harvest", "🌾", "Harvest", "#ff9800")}
        </div>

        {selectedTool !== "hand" && (
          <div className="tool-info">
            <span className="tool-description">
              {selectedTool === "water" && "Click on plots to water your crops"}
              {selectedTool === "fertilize" &&
                "Click on plots to apply fertilizer"}
              {selectedTool === "pesticide" &&
                "Click on plots to eliminate pests"}
              {selectedTool === "harvest" && "Click on ready crops to harvest"}
            </span>
          </div>
        )}
      </div>

      {/* Enhanced Game Content */}
      <div className="game-content">
        <div className="main-area">
          <div className="farm-section">
            <div className="section-header">
              <h2 className="section-title">
                <Sparkles className="title-icon" />
                Your Farm
              </h2>
              <div className="farm-overview">
                <div className="overview-stat">
                  <span className="stat-icon">🌱</span>
                  <span>
                    {farmPlots.filter((p) => p.status !== "empty").length}/
                    {farmPlots.length} Planted
                  </span>
                </div>
                <div className="overview-stat">
                  <span className="stat-icon">🌾</span>
                  <span>{farmPlots.filter((p) => p.isReady).length} Ready</span>
                </div>
                <div className="overview-stat">
                  <span className="stat-icon">❤️</span>
                  <span>
                    {Math.round(
                      farmPlots.reduce((sum, plot) => sum + plot.health, 0) /
                        farmPlots.length
                    )}
                    % Health
                  </span>
                </div>
              </div>
            </div>

            <div className="farm-grid">{farmPlots.map(renderPlot)}</div>
          </div>
        </div>

        <div className="sidebar">
          <div className="inventory-section">
            <h3 className="sidebar-title">Inventory</h3>
            <div className="inventory-content">
              <div className="inventory-grid">
                {playerState.inventory.slice(0, 8).map((item, index) => (
                  <div
                    key={index}
                    className={`inventory-slot ${item.rarity}`}
                    style={{ "--rarity-color": getRarityColor(item.rarity) }}
                  >
                    <div className="slot-content">
                      <span className="item-emoji">{item.emoji}</span>
                      <span className="item-quantity">{item.quantity}</span>
                    </div>
                    <div className="item-tooltip">
                      <div className="tooltip-header">
                        <span className="tooltip-name">{item.name}</span>
                        <span className={`tooltip-rarity ${item.rarity}`}>
                          {item.rarity?.charAt(0).toUpperCase() +
                            item.rarity?.slice(1)}
                        </span>
                      </div>
                      <div className="tooltip-type">{item.type}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="small"
                onClick={() => setShowMarketModal(true)}
                className="view-all-button"
              >
                View All Items
              </Button>
            </div>
          </div>

          <div className="quick-stats">
            <h3 className="sidebar-title">Statistics</h3>
            <div className="stats-grid">
              <div className="quick-stat">
                <span className="stat-label">Total Harvests</span>
                <span className="stat-value">{playerState.totalHarvests}</span>
              </div>
              <div className="quick-stat">
                <span className="stat-label">Daily Streak</span>
                <span className="stat-value">{playerState.streak} days</span>
              </div>
              <div className="quick-stat">
                <span className="stat-label">Achievements</span>
                <span className="stat-value">
                  {playerState.achievements.length}/{achievementsList.length}
                </span>
              </div>
              <div className="quick-stat">
                <span className="stat-label">Farm Value</span>
                <span className="stat-value">
                  {(
                    playerState.greenCoins +
                    playerState.ecoGems * 10
                  ).toLocaleString()}
                  🪙
                </span>
              </div>
            </div>
          </div>

          <div className="achievements-preview">
            <h3 className="sidebar-title">Recent Achievements</h3>
            <div className="recent-achievements">
              {playerState.achievements.slice(-3).map((achievementId) => {
                const achievement = achievementsList.find(
                  (a) => a.id === achievementId
                );
                return achievement ? (
                  <div key={achievementId} className="mini-achievement">
                    <span className="achievement-icon">{achievement.icon}</span>
                    <span className="achievement-name">
                      {achievement.title}
                    </span>
                  </div>
                ) : null;
              })}
              {playerState.achievements.length === 0 && (
                <p className="no-achievements">
                  Complete quests to unlock achievements!
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="small"
              onClick={() => setShowAchievementsModal(true)}
              className="view-all-button"
            >
              View All Achievements
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Ground Animation */}
      <div className="ground-background">
        <div className="grass-layer">
          <div className="grass-blade"></div>
          <div className="grass-blade"></div>
          <div className="grass-blade"></div>
        </div>
        <div className="dirt-layer"></div>
        <div className="tractor-animation">
          <div className="tractor">🚜</div>
        </div>
      </div>

      {/* All the existing modals with enhanced styling... */}
      {/* Plot Modal */}
      <Modal
        isOpen={showPlotModal}
        onClose={() => setShowPlotModal(false)}
        title={`Plot ${currentPlotId} ${
          currentPlot?.crop ? `- ${currentPlot.crop}` : "- Empty Plot"
        }`}
        size="large"
        className="plot-modal"
      >
        {currentPlot && (
          <div className="enhanced-plot-modal">
            <div className="plot-status-overview">
              <div className="status-grid">
                <div className="status-card">
                  <span className="status-label">Status</span>
                  <span className={`status-value ${currentPlot.status}`}>
                    {currentPlot.status === "empty"
                      ? "Empty"
                      : currentPlot.status === "planted"
                      ? "Growing"
                      : currentPlot.isReady
                      ? "Ready to Harvest"
                      : "Growing"}
                  </span>
                </div>
                <div className="status-card">
                  <span className="status-label">Health</span>
                  <div className="health-display">
                    <span className="status-value">{currentPlot.health}%</span>
                    <div className="health-bar-mini">
                      <div
                        className="health-fill-mini"
                        style={{
                          width: `${currentPlot.health}%`,
                          backgroundColor:
                            currentPlot.health > 70
                              ? "#4caf50"
                              : currentPlot.health > 40
                              ? "#ff9800"
                              : "#f44336",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="status-card">
                  <span className="status-label">Moisture</span>
                  <div className="moisture-display">
                    <span className="status-value">
                      {currentPlot.moisture}%
                    </span>
                    <div className="moisture-indicator">
                      💧{" "}
                      {currentPlot.moisture < 30
                        ? "Low"
                        : currentPlot.moisture < 70
                        ? "Good"
                        : "High"}
                    </div>
                  </div>
                </div>
                <div className="status-card">
                  <span className="status-label">Nutrients</span>
                  <span className="status-value">{currentPlot.nutrients}%</span>
                </div>
                <div className="status-card">
                  <span className="status-label">Growth</span>
                  <div className="growth-display">
                    <span className="status-value">
                      {currentPlot.growthStage}/4
                    </span>
                    <ProgressBar
                      value={(currentPlot.growthStage / 4) * 100}
                      height={4}
                      color="success"
                    />
                  </div>
                </div>
                <div className="status-card">
                  <span className="status-label">Quality</span>
                  <span
                    className={`status-value quality-${currentPlot.quality}`}
                  >
                    {currentPlot.quality === "perfect" && "👑 "}
                    {currentPlot.quality === "premium" && "⭐ "}
                    {currentPlot.quality.charAt(0).toUpperCase() +
                      currentPlot.quality.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="plot-actions-section">
              {currentPlot.status === "empty" && (
                <div className="crop-selection-enhanced">
                  <h3 className="section-subtitle">🌱 Plant a Crop</h3>
                  <div className="crop-options-grid">
                    {Object.entries(cropData).map(([key, crop]) => {
                      const seedInventory = playerState.inventory.find(
                        (item) => item.name === crop.seedName
                      );
                      const hasSeeds =
                        seedInventory && seedInventory.quantity > 0;

                      return (
                        <div
                          key={key}
                          className={`crop-option ${
                            hasSeeds ? "available" : "unavailable"
                          } ${crop.rarity}`}
                          onClick={() => hasSeeds && plantCrop(crop.name)}
                          style={{
                            "--rarity-color": getRarityColor(crop.rarity),
                          }}
                        >
                          <div className="crop-option-header">
                            <span className="crop-emoji-large">
                              {crop.emoji}
                            </span>
                            <div className="crop-rarity-badge">
                              {crop.rarity}
                            </div>
                          </div>
                          <div className="crop-option-info">
                            <h4 className="crop-name">{crop.name}</h4>
                            <p className="crop-description">
                              {crop.description}
                            </p>
                            <div className="crop-stats">
                              <div className="crop-stat">
                                <span>🕒 {crop.growthTime}s</span>
                              </div>
                              <div className="crop-stat">
                                <span>💰 {crop.baseSellPrice}🪙</span>
                              </div>
                              <div className="crop-stat">
                                <span>⭐ {crop.xpReward}XP</span>
                              </div>
                            </div>
                            <div className="seed-availability">
                              {hasSeeds ? (
                                <span className="seeds-available">
                                  {seedInventory.quantity} seeds available
                                </span>
                              ) : (
                                <span className="no-seeds">
                                  No seeds - Visit Market
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentPlot.status !== "empty" && (
                <div className="plot-actions-enhanced">
                  <h3 className="section-subtitle">🔧 Farm Actions</h3>
                  <div className="actions-grid">
                    <Button
                      variant={currentPlot.needsWater ? "primary" : "outline"}
                      onClick={() => handlePlotAction("water")}
                      disabled={currentPlot.moisture >= 90}
                      className="enhanced-action-button"
                    >
                      <span className="action-icon">💧</span>
                      <div className="action-info">
                        <span className="action-label">Water</span>
                        <span className="action-description">
                          {currentPlot.moisture >= 90
                            ? "Fully watered"
                            : currentPlot.needsWater
                            ? "Needs water!"
                            : "Optional"}
                        </span>
                      </div>
                    </Button>

                    <Button
                      variant={
                        currentPlot.nutrients < 50 ? "primary" : "outline"
                      }
                      onClick={() => handlePlotAction("fertilize")}
                      disabled={currentPlot.nutrients >= 90}
                      className="enhanced-action-button"
                    >
                      <span className="action-icon">🌱</span>
                      <div className="action-info">
                        <span className="action-label">Fertilize</span>
                        <span className="action-description">
                          {currentPlot.nutrients >= 90
                            ? "Well fertilized"
                            : "Boost growth"}
                        </span>
                      </div>
                    </Button>

                    <Button
                      variant={currentPlot.hasPests ? "primary" : "outline"}
                      onClick={() => handlePlotAction("pesticide")}
                      disabled={!currentPlot.hasPests}
                      className="enhanced-action-button"
                    >
                      <span className="action-icon">🧪</span>
                      <div className="action-info">
                        <span className="action-label">Pesticide</span>
                        <span className="action-description">
                          {currentPlot.hasPests
                            ? "Remove pests!"
                            : "No pests detected"}
                        </span>
                      </div>
                    </Button>

                    {currentPlot.isReady && (
                      <Button
                        variant="primary"
                        onClick={() => handlePlotAction("harvest")}
                        className="enhanced-action-button harvest-button"
                      >
                        <span className="action-icon">🌾</span>
                        <div className="action-info">
                          <span className="action-label">Harvest</span>
                          <span className="action-description">
                            {currentPlot.quality !== "normal" &&
                              `${currentPlot.quality.toUpperCase()} quality!`}
                            Ready to harvest!
                          </span>
                        </div>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Enhanced Quests Modal */}
      <Modal
        isOpen={showQuestsModal}
        onClose={() => setShowQuestsModal(false)}
        title="🏆 Quest Journal"
        size="large"
        className="quests-modal"
      >
        <div className="enhanced-quests-content">
          <div className="quests-header">
            <div className="quest-stats">
              <div className="quest-stat">
                <span className="stat-number">
                  {quests.filter((q) => q.status === "completed").length}
                </span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="quest-stat">
                <span className="stat-number">
                  {quests.filter((q) => q.status === "claimable").length}
                </span>
                <span className="stat-label">Ready to Claim</span>
              </div>
              <div className="quest-stat">
                <span className="stat-number">
                  {quests.filter((q) => q.status === "incomplete").length}
                </span>
                <span className="stat-label">In Progress</span>
              </div>
            </div>
          </div>

          <div className="quests-list">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={`enhanced-quest-card ${quest.status} ${quest.type}`}
              >
                <div className="quest-card-header">
                  <div className="quest-type-badge">{quest.type}</div>
                  <div className="quest-status-indicator">
                    {quest.status === "completed" && (
                      <span className="status-icon">✅</span>
                    )}
                    {quest.status === "claimable" && (
                      <span className="status-icon pulsing">🎁</span>
                    )}
                    {quest.status === "incomplete" && (
                      <span className="status-icon">⏳</span>
                    )}
                  </div>
                </div>

                <div className="quest-content">
                  <h4 className="quest-title">{quest.title}</h4>
                  <p className="quest-description">{quest.description}</p>

                  <div className="quest-progress-section">
                    <div className="progress-info">
                      <span className="progress-text">
                        Progress: {quest.progress}/{quest.target}
                      </span>
                      <span className="progress-percentage">
                        {Math.round((quest.progress / quest.target) * 100)}%
                      </span>
                    </div>
                    <ProgressBar
                      value={(quest.progress / quest.target) * 100}
                      height={8}
                      color={
                        quest.status === "claimable" ? "warning" : "primary"
                      }
                      animated={quest.status !== "completed"}
                    />
                  </div>

                  <div className="quest-rewards">
                    <span className="rewards-label">Rewards:</span>
                    <div className="reward-items">
                      <span className="reward-item">
                        <span className="reward-icon">🪙</span>
                        <span className="reward-value">
                          {quest.reward.coins}
                        </span>
                      </span>
                      {quest.reward.gems && (
                        <span className="reward-item">
                          <span className="reward-icon">💎</span>
                          <span className="reward-value">
                            {quest.reward.gems}
                          </span>
                        </span>
                      )}
                      <span className="reward-item">
                        <span className="reward-icon">⭐</span>
                        <span className="reward-value">
                          {quest.reward.experience}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="quest-actions">
                  {quest.status === "claimable" && (
                    <Button
                      variant="primary"
                      onClick={() => claimQuestReward(quest.id)}
                      className="claim-reward-button"
                    >
                      <Gift size={16} />
                      Claim Reward
                    </Button>
                  )}
                  {quest.status === "completed" && (
                    <div className="quest-completed-badge">
                      <Trophy size={16} />
                      Completed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Enhanced Market Modal */}
      <Modal
        isOpen={showMarketModal}
        onClose={() => setShowMarketModal(false)}
        title="🏪 Farmers Market"
        size="xlarge"
        className="market-modal"
      >
        <div className="enhanced-market-content">
          <div className="market-tabs">
            <div className="tab-buttons">
              <button className="tab-button active">Buy Seeds & Tools</button>
              <button className="tab-button">Sell Crops</button>
              <button className="tab-button">Market Prices</button>
            </div>
          </div>

          <div className="market-sections">
            <div className="market-section buy-section">
              <h3 className="market-section-title">🛒 Purchase Items</h3>
              <div className="market-items-grid">
                {marketBuyItems.map((item, index) => (
                  <div
                    key={index}
                    className={`market-item-card ${item.rarity}`}
                    style={{ "--rarity-color": getRarityColor(item.rarity) }}
                  >
                    <div className="item-card-header">
                      <span className="item-emoji-large">{item.emoji}</span>
                      <div className="item-rarity-badge">{item.rarity}</div>
                    </div>

                    <div className="item-card-content">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-description">{item.description}</p>
                      <div className="item-type-tag">{item.type}</div>
                    </div>

                    <div className="item-card-footer">
                      <div className="item-price-display">
                        <span className="price-icon">🪙</span>
                        <span className="price-value">{item.price}</span>
                      </div>
                      <Button
                        variant={
                          playerState.greenCoins >= item.price
                            ? "primary"
                            : "outline"
                        }
                        size="small"
                        onClick={() => buyMarketItem(item.name)}
                        disabled={playerState.greenCoins < item.price}
                        className="buy-button"
                      >
                        {playerState.greenCoins >= item.price
                          ? "Buy"
                          : "Insufficient Funds"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="market-section sell-section">
              <h3 className="market-section-title">💰 Sell Your Harvest</h3>
              <div className="crop-prices-header">
                <div className="market-trend">
                  <span className="trend-label">Today's Market Trends</span>
                  <div className="trend-indicators">
                    <span className="trend-up">📈 High Demand</span>
                    <span className="trend-stable">➖ Stable</span>
                    <span className="trend-down">📉 Low Prices</span>
                  </div>
                </div>
              </div>

              <div className="sell-items-grid">
                {Object.entries(cropData).map(([key, crop]) => {
                  const readyCrops = farmPlots.filter(
                    (p) => p.crop === crop.name && p.isReady
                  );
                  if (readyCrops.length === 0) return null;

                  const currentPrice = marketPrices[key] || crop.baseSellPrice;
                  const basePrice = crop.baseSellPrice;
                  const priceChange =
                    ((currentPrice - basePrice) / basePrice) * 100;

                  return (
                    <div key={key} className={`sell-item-card ${crop.rarity}`}>
                      <div className="sell-item-header">
                        <span className="crop-emoji-large">{crop.emoji}</span>
                        <div className="price-trend">
                          {priceChange > 10 && (
                            <span className="trend-indicator up">📈</span>
                          )}
                          {Math.abs(priceChange) <= 10 && (
                            <span className="trend-indicator stable">➖</span>
                          )}
                          {priceChange < -10 && (
                            <span className="trend-indicator down">📉</span>
                          )}
                        </div>
                      </div>

                      <div className="sell-item-content">
                        <h4 className="crop-name">{crop.name}</h4>
                        <div className="crop-inventory">
                          <span className="ready-count">
                            {readyCrops.length} ready to harvest
                          </span>
                          <div className="quality-breakdown">
                            {readyCrops.filter((c) => c.quality === "perfect")
                              .length > 0 && (
                              <span className="quality-count perfect">
                                👑{" "}
                                {
                                  readyCrops.filter(
                                    (c) => c.quality === "perfect"
                                  ).length
                                }
                              </span>
                            )}
                            {readyCrops.filter((c) => c.quality === "premium")
                              .length > 0 && (
                              <span className="quality-count premium">
                                ⭐{" "}
                                {
                                  readyCrops.filter(
                                    (c) => c.quality === "premium"
                                  ).length
                                }
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="price-info">
                          <div className="current-price">
                            <span className="price-label">Market Price:</span>
                            <span className="price-value">
                              🪙{currentPrice}
                            </span>
                          </div>
                          {Math.abs(priceChange) > 5 && (
                            <div
                              className={`price-change ${
                                priceChange > 0 ? "positive" : "negative"
                              }`}
                            >
                              {priceChange > 0 ? "+" : ""}
                              {priceChange.toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="sell-item-footer">
                        <div className="total-value">
                          <span>
                            Total: 🪙{currentPrice * readyCrops.length}
                          </span>
                        </div>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => {
                            // Sell all ready crops of this type
                            readyCrops.forEach(() => {
                              handlePlotAction("harvest");
                            });
                            setShowMarketModal(false);
                          }}
                          className="sell-all-button"
                        >
                          Harvest & Sell All
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {Object.entries(cropData).filter(([key, crop]) =>
                  farmPlots.some((p) => p.crop === crop.name && p.isReady)
                ).length === 0 && (
                  <div className="no-crops-message">
                    <span className="no-crops-icon">🌱</span>
                    <h4>No crops ready for sale</h4>
                    <p>Plant and grow crops to start selling at the market!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Enhanced Achievements Modal */}
      <Modal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        title="🏆 Hall of Fame"
        size="large"
        className="achievements-modal"
      >
        <div className="enhanced-achievements-content">
          <div className="achievements-overview">
            <div className="achievement-progress">
              <div className="progress-circle">
                <div className="progress-text">
                  {Math.round(
                    (playerState.achievements.length /
                      achievementsList.length) *
                      100
                  )}
                  %
                </div>
              </div>
              <div className="progress-details">
                <span className="progress-label">Achievement Progress</span>
                <span className="progress-fraction">
                  {playerState.achievements.length} of {achievementsList.length}{" "}
                  unlocked
                </span>
              </div>
            </div>
          </div>

          <div className="achievements-grid">
            {achievementsList.map((achievement) => {
              const isUnlocked = playerState.achievements.includes(
                achievement.id
              );
              return (
                <div
                  key={achievement.id}
                  className={`achievement-card ${
                    isUnlocked ? "unlocked" : "locked"
                  } ${achievement.rarity}`}
                  style={{
                    "--rarity-color": getRarityColor(achievement.rarity),
                  }}
                >
                  <div className="achievement-card-header">
                    <div className="achievement-icon-container">
                      <span className="achievement-icon">
                        {isUnlocked ? achievement.icon : "🔒"}
                      </span>
                      {isUnlocked && <div className="unlock-glow"></div>}
                    </div>
                    <div className="achievement-rarity-badge">
                      {achievement.rarity}
                    </div>
                  </div>

                  <div className="achievement-card-content">
                    <h4 className="achievement-title">{achievement.title}</h4>
                    <p className="achievement-description">
                      {achievement.description}
                    </p>

                    {isUnlocked && achievement.reward && (
                      <div className="achievement-rewards">
                        <span className="rewards-label">Rewards Earned:</span>
                        <div className="reward-items">
                          <span className="reward-item">
                            🪙 {achievement.reward.coins}
                          </span>
                          {achievement.reward.gems && (
                            <span className="reward-item">
                              💎 {achievement.reward.gems}
                            </span>
                          )}
                          <span className="reward-item">
                            ⭐ {achievement.reward.experience}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="achievement-card-footer">
                    {isUnlocked ? (
                      <div className="achievement-unlocked">
                        <Sparkles size={16} />
                        <span>Unlocked!</span>
                      </div>
                    ) : (
                      <div className="achievement-locked">
                        <span>🔐 Complete to unlock</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      {/* Enhanced Weather Modal */}
      <Modal
        isOpen={showWeatherModal}
        onClose={() => setShowWeatherModal(false)}
        title="🌤️ Weather Station"
        size="large"
        className="weather-modal"
      >
        <div className="enhanced-weather-content">
          <div className="current-weather-section">
            <h3 className="weather-section-title">Current Conditions</h3>
            <div className="current-weather-display">
              <div className="weather-visual">
                <div className="weather-icon-large">
                  {weather.condition === "sunny" && "☀️"}
                  {weather.condition === "cloudy" && "☁️"}
                  {weather.condition === "rainy" && "🌧️"}
                  {weather.condition === "stormy" && "⛈️"}
                </div>
                <div className="weather-effects">
                  {weather.condition === "rainy" && (
                    <div className="rain-effect"></div>
                  )}
                  {weather.condition === "sunny" && (
                    <div className="sun-rays"></div>
                  )}
                  {weather.condition === "stormy" && (
                    <div className="lightning-effect"></div>
                  )}
                </div>
              </div>

              <div className="weather-details">
                <div className="weather-main-info">
                  <h4 className="weather-condition">
                    {weather.condition.charAt(0).toUpperCase() +
                      weather.condition.slice(1)}
                  </h4>
                  <div className="temperature-display">
                    <span className="temperature">{weather.temperature}</span>
                    <span className="temperature-unit">°C</span>
                  </div>
                </div>

                <div className="weather-metrics">
                  <div className="weather-metric">
                    <span className="metric-label">Humidity</span>
                    <div className="metric-value">
                      <ProgressBar
                        value={weather.humidity}
                        height={6}
                        color="info"
                      />
                      <span>{weather.humidity}%</span>
                    </div>
                  </div>
                  <div className="weather-metric">
                    <span className="metric-label">Severity</span>
                    <div className="severity-indicator">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`severity-dot ${
                            i < weather.severity ? "active" : ""
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="weather-impact">
              <h4>Impact on Crops:</h4>
              <div className="impact-list">
                {weather.condition === "sunny" && (
                  <div className="impact-item positive">
                    <span className="impact-icon">🌱</span>
                    <span>+10% growth rate, -8% moisture per hour</span>
                  </div>
                )}
                {weather.condition === "rainy" && (
                  <div className="impact-item positive">
                    <span className="impact-icon">💧</span>
                    <span>+5% growth rate, +15% moisture per hour</span>
                  </div>
                )}
                {weather.condition === "cloudy" && (
                  <div className="impact-item neutral">
                    <span className="impact-icon">☁️</span>
                    <span>Normal growth rate, -3% moisture per hour</span>
                  </div>
                )}
                {weather.condition === "stormy" && (
                  <div className="impact-item negative">
                    <span className="impact-icon">⚡</span>
                    <span>-10% growth rate, -5% moisture, -2% health</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="forecast-section">
            <h3 className="weather-section-title">7-Day Forecast</h3>
            <div className="forecast-timeline">
              {weather.forecast.map((day, index) => (
                <div
                  key={index}
                  className={`forecast-day ${index === 0 ? "today" : ""}`}
                >
                  <div className="forecast-day-header">
                    <span className="day-label">
                      {index === 0 ? "Today" : `Day ${day.day}`}
                    </span>
                  </div>

                  <div className="forecast-weather">
                    <div className="forecast-icon">
                      {day.condition === "sunny" && "☀️"}
                      {day.condition === "cloudy" && "☁️"}
                      {day.condition === "rainy" && "🌧️"}
                      {day.condition === "stormy" && "⛈️"}
                    </div>
                    <span className="forecast-condition">
                      {day.condition.charAt(0).toUpperCase() +
                        day.condition.slice(1)}
                    </span>
                  </div>

                  <div className="forecast-details">
                    <div className="forecast-temp">{day.temperature}°C</div>
                    <div className="forecast-humidity">
                      {day.humidity}% humidity
                    </div>
                    <div className="forecast-severity">
                      Severity:{" "}
                      {[...Array(day.severity)].map((_, i) => "●").join("")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Enhanced Notification System */}
      {showNotification && (
        <div className="enhanced-notification-overlay">
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={() => setShowNotification(false)}
            reward={notification.reward}
            duration={4000}
          />
        </div>
      )}
    </div>
  );
};

export default GreenTwinGame;
