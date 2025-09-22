// Mock data generator for the prototype
export const generateFarmData = () => {
  return {
    status: Math.random() > 0.3 ? "healthy" : "warning",
    size: (Math.random() * 3 + 1).toFixed(1),
    crops: ["Rice", "Tomatoes", "Spinach", "Wheat"][
      Math.floor(Math.random() * 4)
    ],
    waterUsage: Math.floor(Math.random() * 500 + 800),
    overallHealth: Math.floor(Math.random() * 30 + 60),
    sustainabilityScore: Math.floor(Math.random() * 40 + 50),
    soilMoisture: Math.floor(Math.random() * 40 + 30),
    cropHealth: Math.floor(Math.random() * 30 + 60),
  };
};

export const generateWeatherData = () => {
  const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Stormy"];
  const currentCondition =
    conditions[Math.floor(Math.random() * conditions.length)];

  return {
    current: {
      temperature: Math.floor(Math.random() * 10 + 25),
      condition: currentCondition,
      humidity: Math.floor(Math.random() * 30 + 50),
      windSpeed: Math.floor(Math.random() * 15 + 5),
    },
    forecast: Array.from({ length: 5 }, (_, i) => ({
      day: i === 0 ? "Today" : `Day ${i + 1}`,
      temperature: Math.floor(Math.random() * 8 + 26),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
    })),
  };
};

export const generateGameData = () => {
  return {
    player: {
      id: "farmer_001",
      name: "Green Farmer",
      level: Math.floor(Math.random() * 5 + 1),
      experience: Math.floor(Math.random() * 2000 + 500),
      experienceToNextLevel: 2000,
      coins: Math.floor(Math.random() * 1000 + 500),
      gems: Math.floor(Math.random() * 20 + 5),
    },
    quests: {
      daily: [
        {
          id: "daily_001",
          title: "Morning Watering",
          description: "Irrigate all fields before 10 AM",
          type: "daily",
          difficulty: "easy",
          rewards: { coins: 50, experience: 30 },
          progress: { current: Math.floor(Math.random() * 3), target: 3 },
          completed: Math.random() > 0.7,
        },
        {
          id: "daily_002",
          title: "Pest Patrol",
          description: "Check all crops for pest damage",
          type: "daily",
          difficulty: "medium",
          rewards: { coins: 75, experience: 50 },
          progress: { current: Math.floor(Math.random() * 5), target: 5 },
          completed: Math.random() > 0.7,
        },
      ],
      weekly: [
        {
          id: "weekly_001",
          title: "Organic Week",
          description: "Use only organic fertilizers for 7 days",
          type: "weekly",
          difficulty: "hard",
          rewards: { coins: 300, experience: 200, gems: 5 },
          progress: { current: Math.floor(Math.random() * 7), target: 7 },
          completed: Math.random() > 0.8,
        },
      ],
      achievements: [
        {
          id: "ach_001",
          title: "First Harvest",
          description: "Harvest your first crop",
          type: "achievement",
          rewards: { coins: 100, experience: 100 },
          progress: { current: 1, target: 1 },
          completed: true,
        },
        {
          id: "ach_002",
          title: "Green Thumb",
          description: "Reach 90% crop health across all fields",
          type: "achievement",
          rewards: { coins: 500, experience: 500, gems: 10 },
          progress: {
            current: Math.floor(Math.random() * 30 + 60),
            target: 90,
          },
          completed: Math.random() > 0.9,
        },
      ],
    },
  };
};
