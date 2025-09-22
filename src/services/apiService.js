// Mock API service for the prototype
const API_BASE_URL = "http://localhost:5000/api";

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getFarmData = async () => {
  await delay(800);
  return {
    status: "healthy",
    size: 2.5,
    crops: "Rice, Tomatoes",
    waterUsage: 1200,
    overallHealth: 78,
    sustainabilityScore: 65,
    soilMoisture: 45,
    cropHealth: 82,
  };
};

export const getWeatherData = async () => {
  await delay(600);
  return {
    current: {
      temperature: 28,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12,
    },
    forecast: [
      { day: "Today", temperature: 28, condition: "Partly Cloudy" },
      { day: "Tomorrow", temperature: 30, condition: "Sunny" },
      { day: "Day 3", temperature: 27, condition: "Rainy" },
      { day: "Day 4", temperature: 26, condition: "Cloudy" },
      { day: "Day 5", temperature: 29, condition: "Sunny" },
    ],
  };
};

export const getGameData = async () => {
  await delay(500);
  const response = await fetch(`${API_BASE_URL}/game-data`);
  return response.json();
};

export const getPlayerData = async () => {
  await delay(400);
  const response = await fetch(`${API_BASE_URL}/player-data`);
  return response.json();
};

export const getQuests = async () => {
  await delay(450);
  const response = await fetch(`${API_BASE_URL}/quests`);
  return response.json();
};

export const getCoops = async () => {
  await delay(550);
  const response = await fetch(`${API_BASE_URL}/coops`);
  return response.json();
};

export const getEconomy = async () => {
  await delay(500);
  const response = await fetch(`${API_BASE_URL}/economy`);
  return response.json();
};

export const getLeaderboard = async (type = "weekly") => {
  await delay(600);
  const response = await fetch(`${API_BASE_URL}/leaderboard?type=${type}`);
  return response.json();
};

export const getEvents = async () => {
  await delay(400);
  const response = await fetch(`${API_BASE_URL}/events`);
  return response.json();
};

export const completeQuest = async (questId) => {
  await delay(700);
  const response = await fetch(`${API_BASE_URL}/complete-quest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questId }),
  });
  return response.json();
};

export const joinCoop = async (coopId) => {
  await delay(800);
  const response = await fetch(`${API_BASE_URL}/join-coop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coopId }),
  });
  return response.json();
};

export const purchaseItem = async (itemId, quantity = 1) => {
  await delay(600);
  const response = await fetch(`${API_BASE_URL}/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, quantity }),
  });
  return response.json();
};

export const updateFarmData = async (data) => {
  await delay(500);
  console.log("Updating farm data:", data);
  return { success: true };
};
