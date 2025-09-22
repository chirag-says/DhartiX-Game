module.exports = {
  status: "healthy",
  size: 2.5,
  crops: "Rice, Tomatoes",
  waterUsage: 1200,
  overallHealth: 78,
  sustainabilityScore: 65,
  soilMoisture: 45,
  cropHealth: 82,
  quests: [
    {
      id: 1,
      title: "Irrigate Field A",
      description: "Apply 15L of water to Field A",
      completed: false,
      reward: "50 XP",
    },
    {
      id: 2,
      title: "Apply Compost",
      description: "Apply 5kg of compost to Field B",
      completed: true,
      reward: "30 XP",
    },
    {
      id: 3,
      title: "Scout for Pests",
      description: "Check Field C for signs of pests",
      completed: false,
      reward: "40 XP",
    },
  ],
  achievements: [
    {
      id: 1,
      title: "First Harvest",
      description: "Harvest your first crop",
      earned: true,
    },
    {
      id: 2,
      title: "Green Thumb",
      description: "Reach 90% crop health",
      earned: false,
    },
    {
      id: 3,
      title: "Water Saver",
      description: "Reduce water usage by 20%",
      earned: false,
    },
  ],
};
