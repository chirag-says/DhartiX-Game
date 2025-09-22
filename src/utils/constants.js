// Application constants

// API endpoints
export const API_ENDPOINTS = {
  FARM_DATA: "/api/farm-data",
  WEATHER_DATA: "/api/weather-data",
  GAME_DATA: "/api/game-data",
  PLAYER_DATA: "/api/player-data",
  QUESTS: "/api/quests",
  COOPS: "/api/coops",
  ECONOMY: "/api/economy",
  LEADERBOARD: "/api/leaderboard",
  EVENTS: "/api/events",
  COMPLETE_QUEST: "/api/complete-quest",
  JOIN_COOP: "/api/join-coop",
  PURCHASE: "/api/purchase",
  UPDATE_FARM: "/api/update-farm",
};

// Game constants
export const GAME_CONSTANTS = {
  MAX_LEVEL: 100,
  EXPERIENCE_PER_LEVEL: 1000,
  STARTING_COINS: 500,
  STARTING_GEMS: 10,
  MAX_COOP_MEMBERS: 20,
  MAX_QUESTS_DAILY: 3,
  MAX_QUESTS_WEEKLY: 1,
};

// Farm constants
export const FARM_CONSTANTS = {
  MAX_FIELDS: 10,
  DEFAULT_FIELD_SIZE: 1.0, // in acres
  OPTIMAL_SOIL_MOISTURE: 70, // percentage
  OPTIMAL_CROP_HEALTH: 90, // percentage
  WATER_USAGE_PER_ACRE: 500, // liters per day
};

// UI constants
export const UI_CONSTANTS = {
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200,
  },
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
};

// Color constants
export const COLORS = {
  PRIMARY: "#4CAF50",
  PRIMARY_DARK: "#388E3C",
  SECONDARY: "#FF9800",
  SECONDARY_DARK: "#F57C00",
  BACKGROUND: "#F1F8E9",
  CARD_BG: "#FFFFFF",
  TEXT_PRIMARY: "#212121",
  TEXT_SECONDARY: "#757575",
  ERROR: "#F44336",
  SUCCESS: "#4CAF50",
  WARNING: "#FFC107",
  INFO: "#2196F3",
};

// Crop types
export const CROP_TYPES = {
  RICE: {
    name: "Rice",
    icon: "🌾",
    season: "Kharif",
    waterNeed: "High",
    growthTime: "120 days",
    sustainability: 3,
  },
  TOMATO: {
    name: "Tomato",
    icon: "🍅",
    season: "Rabi",
    waterNeed: "Medium",
    growthTime: "90 days",
    sustainability: 4,
  },
  SPINACH: {
    name: "Spinach",
    icon: "🥬",
    season: "Zaid",
    waterNeed: "Medium",
    growthTime: "45 days",
    sustainability: 4,
  },
  WHEAT: {
    name: "Wheat",
    icon: "🌾",
    season: "Rabi",
    waterNeed: "Medium",
    growthTime: "140 days",
    sustainability: 3,
  },
  CORN: {
    name: "Corn",
    icon: "🌽",
    season: "Kharif",
    waterNeed: "High",
    growthTime: "100 days",
    sustainability: 2,
  },
};

// Weather conditions
export const WEATHER_CONDITIONS = [
  "Sunny",
  "Partly Cloudy",
  "Cloudy",
  "Rainy",
  "Stormy",
];

// Quest types
export const QUEST_TYPES = {
  DAILY: "daily",
  WEEKLY: "weekly",
  ACHIEVEMENT: "achievement",
};

// Quest difficulties
export const QUEST_DIFFICULTIES = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};
