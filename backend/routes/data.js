// Mock data generator for Green-Twin backend
const generateFarmData = () => {
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
    fields: [
      {
        id: "field_a",
        name: "Field A",
        size: "1.2 acres",
        crop: "Rice",
        health: 85,
      },
      {
        id: "field_b",
        name: "Field B",
        size: "0.8 acres",
        crop: "Tomatoes",
        health: 92,
      },
      {
        id: "field_c",
        name: "Field C",
        size: "0.5 acres",
        crop: "Spinach",
        health: 78,
      },
    ],
    resources: {
      water: { current: 1200, max: 2000, unit: "L" },
      fertilizer: { current: 45, max: 100, unit: "kg" },
      seeds: { current: 120, max: 200, unit: "packs" },
      energy: { current: 75, max: 100, unit: "%" },
    },
  };
};

const generateWeatherData = () => {
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

const generateGameData = () => {
  return {
    player: {
      id: "farmer_001",
      name: "Green Farmer",
      level: Math.floor(Math.random() * 5 + 1),
      experience: Math.floor(Math.random() * 2000 + 500),
      experienceToNextLevel: 2000,
      coins: Math.floor(Math.random() * 1000 + 500),
      gems: Math.floor(Math.random() * 20 + 5),
      joinDate: "2023-05-15",
      lastActive: "2023-09-20",
      avatar: "farmer_001.png",
      title: "Eco Warrior",
    },
    quests: {
      daily: [
        {
          id: "daily_001",
          title: "Morning Watering",
          description: "Irrigate all fields before 10 AM",
          type: "daily",
          difficulty: "easy",
          timeLimit: "10:00 AM",
          rewards: { coins: 50, experience: 30 },
          requirements: { action: "irrigate_all", target: "all_fields" },
          progress: { current: Math.floor(Math.random() * 3), target: 3 },
          completed: Math.random() > 0.7,
          expires: "2023-09-21T10:00:00Z",
        },
        {
          id: "daily_002",
          title: "Pest Patrol",
          description: "Check all crops for pest damage",
          type: "daily",
          difficulty: "medium",
          timeLimit: "6:00 PM",
          rewards: { coins: 75, experience: 50 },
          requirements: { action: "inspect", target: "all_crops" },
          progress: { current: Math.floor(Math.random() * 5), target: 5 },
          completed: Math.random() > 0.7,
          expires: "2023-09-21T18:00:00Z",
        },
      ],
      weekly: [
        {
          id: "weekly_001",
          title: "Organic Week",
          description: "Use only organic fertilizers for 7 days",
          type: "weekly",
          difficulty: "hard",
          timeLimit: "7 days",
          rewards: { coins: 300, experience: 200, gems: 5 },
          requirements: {
            action: "use_organic",
            target: "fertilizers",
            duration: 7,
          },
          progress: { current: Math.floor(Math.random() * 7), target: 7 },
          completed: Math.random() > 0.8,
          expires: "2023-09-27T23:59:59Z",
        },
      ],
      achievements: [
        {
          id: "ach_001",
          title: "First Harvest",
          description: "Harvest your first crop",
          type: "achievement",
          difficulty: "easy",
          rewards: { coins: 100, experience: 100 },
          requirements: { action: "harvest", target: "any_crop" },
          progress: { current: 1, target: 1 },
          completed: true,
          earnedDate: "2023-05-20",
        },
        {
          id: "ach_002",
          title: "Green Thumb",
          description: "Reach 90% crop health across all fields",
          type: "achievement",
          difficulty: "hard",
          rewards: { coins: 500, experience: 500, gems: 10 },
          requirements: {
            action: "maintain_health",
            target: "all_crops",
            threshold: 90,
          },
          progress: {
            current: Math.floor(Math.random() * 30 + 60),
            target: 90,
          },
          completed: Math.random() > 0.9,
        },
        {
          id: "ach_003",
          title: "Water Saver",
          description: "Reduce water usage by 20% for a month",
          type: "achievement",
          difficulty: "medium",
          rewards: { coins: 300, experience: 300 },
          requirements: {
            action: "reduce_water",
            target: "farm",
            percentage: 20,
            duration: 30,
          },
          progress: { current: Math.floor(Math.random() * 20), target: 20 },
          completed: Math.random() > 0.8,
        },
      ],
    },
    coops: {
      playerCoop: {
        id: "coop_001",
        name: "Green Valley Farmers",
        description: "A cooperative of sustainable farmers in Kerala",
        level: 2,
        members: 12,
        maxMembers: 20,
        founded: "2023-03-10",
        resources: {
          coins: 2500,
          seeds: { tomato: 50, rice: 100, spinach: 30 },
          tools: { tractor: 1, irrigation_system: 1 },
        },
        challenges: [
          {
            id: "coop_chal_001",
            title: "Community Water Saving",
            description: "Collectively reduce water usage by 15%",
            type: "coop_challenge",
            difficulty: "medium",
            rewards: { coins: 1000, experience: 500 },
            requirements: {
              action: "reduce_water",
              target: "coop",
              percentage: 15,
            },
            progress: { current: Math.floor(Math.random() * 15), target: 15 },
            completed: false,
            expires: "2023-10-15T23:59:59Z",
          },
        ],
      },
      availableCoops: [
        {
          id: "coop_002",
          name: "Kerala Organic Collective",
          description: "Promoting organic farming practices across Kerala",
          level: 3,
          members: 18,
          maxMembers: 25,
          founded: "2022-11-05",
        },
        {
          id: "coop_003",
          name: "Spice Growers Alliance",
          description: "Specializing in sustainable spice cultivation",
          level: 4,
          members: 15,
          maxMembers: 20,
          founded: "2022-08-20",
        },
      ],
    },
    economy: {
      shop: {
        seeds: [
          {
            id: "seed_001",
            name: "Rice Seeds",
            price: 50,
            currency: "coins",
            sustainability: 3,
          },
          {
            id: "seed_002",
            name: "Tomato Seeds",
            price: 75,
            currency: "coins",
            sustainability: 4,
          },
          {
            id: "seed_003",
            name: "Spinach Seeds",
            price: 40,
            currency: "coins",
            sustainability: 4,
          },
          {
            id: "seed_004",
            name: "Organic Rice Seeds",
            price: 5,
            currency: "gems",
            sustainability: 5,
          },
          {
            id: "seed_005",
            name: "Drought-Resistant Seeds",
            price: 10,
            currency: "gems",
            sustainability: 5,
          },
        ],
        tools: [
          {
            id: "tool_001",
            name: "Basic Irrigation Kit",
            price: 200,
            currency: "coins",
            efficiency: 2,
          },
          {
            id: "tool_002",
            name: "Organic Fertilizer",
            price: 150,
            currency: "coins",
            efficiency: 3,
          },
          {
            id: "tool_003",
            name: "Smart Irrigation System",
            price: 15,
            currency: "gems",
            efficiency: 5,
          },
          {
            id: "tool_004",
            name: "Solar Water Pump",
            price: 25,
            currency: "gems",
            efficiency: 5,
          },
        ],
        cosmetics: [
          {
            id: "cos_001",
            name: "Farmhouse Theme: Traditional",
            price: 3,
            currency: "gems",
            type: "theme",
          },
          {
            id: "cos_002",
            name: "Field Decoration: Windmill",
            price: 2,
            currency: "gems",
            type: "decoration",
          },
          {
            id: "cos_003",
            name: "Avatar Outfit: Farmer Hat",
            price: 1,
            currency: "gems",
            type: "avatar",
          },
        ],
      },
      marketplace: {
        buyOrders: [
          {
            id: "buy_001",
            item: "Organic Rice",
            quantity: 100,
            price: 120,
            buyer: "Kerala Organics Co.",
          },
          {
            id: "buy_002",
            item: "Tomatoes",
            quantity: 50,
            price: 85,
            buyer: "Fresh Market Ltd.",
          },
          {
            id: "buy_003",
            item: "Spinach",
            quantity: 30,
            price: 65,
            buyer: "Green Grocers",
          },
        ],
        sellOrders: [
          {
            id: "sell_001",
            item: "Rice",
            quantity: 80,
            price: 100,
            seller: "Farmer Raj",
          },
          {
            id: "sell_002",
            item: "Tomatoes",
            quantity: 40,
            price: 75,
            seller: "Green Valley Coop",
          },
        ],
      },
    },
    leaderboard: {
      weekly: [
        {
          rank: 1,
          name: "EcoWarrior",
          score: 4850,
          level: 8,
          coop: "Green Valley Farmers",
        },
        {
          rank: 2,
          name: "SustainableSam",
          score: 4200,
          level: 7,
          coop: "Kerala Organic Collective",
        },
        {
          rank: 3,
          name: "GreenThumb",
          score: 3900,
          level: 6,
          coop: "Spice Growers Alliance",
        },
        {
          rank: 4,
          name: "NatureLover",
          score: 3650,
          level: 6,
          coop: "Green Valley Farmers",
        },
        {
          rank: 5,
          name: "OrganicJoe",
          score: 3400,
          level: 5,
          coop: "Kerala Organic Collective",
        },
        {
          rank: 12,
          name: "Green Farmer",
          score: 1250,
          level: 3,
          coop: "Green Valley Farmers",
        },
      ],
      sustainability: [
        {
          rank: 1,
          name: "ZeroWasteFarm",
          score: 98,
          level: 9,
          coop: "Eco Champions",
        },
        {
          rank: 2,
          name: "CarbonNeutral",
          score: 95,
          level: 8,
          coop: "Green Warriors",
        },
        {
          rank: 3,
          name: "WaterSaver",
          score: 92,
          level: 7,
          coop: "Aqua Saviors",
        },
        {
          rank: 4,
          name: "Biodiverse",
          score: 89,
          level: 7,
          coop: "Nature Lovers",
        },
        {
          rank: 5,
          name: "RenewableRaj",
          score: 87,
          level: 6,
          coop: "Solar Farmers",
        },
        {
          rank: 18,
          name: "Green Farmer",
          score: 65,
          level: 3,
          coop: "Green Valley Farmers",
        },
      ],
    },
    events: {
      current: [
        {
          id: "event_001",
          name: "Monsoon Festival",
          description:
            "Special rewards for water conservation during monsoon season",
          type: "seasonal",
          startDate: "2023-06-01",
          endDate: "2023-09-30",
          rewards: {
            coins: 200,
            experience: 150,
            special: "Rain Collector Decoration",
          },
          challenges: [
            {
              id: "ev_chal_001",
              title: "Rainwater Harvesting",
              description: "Collect 500L of rainwater",
              progress: 320,
              target: 500,
            },
            {
              id: "ev_chal_002",
              title: "Flood Prevention",
              description: "Implement flood measures in all fields",
              progress: 2,
              target: 3,
            },
          ],
        },
      ],
      upcoming: [
        {
          id: "event_002",
          name: "Harvest Festival",
          description: "Celebrate the harvest season with special rewards",
          type: "seasonal",
          startDate: "2023-10-15",
          endDate: "2023-11-15",
          rewards: { coins: 300, experience: 250, special: "Harvest Trophy" },
        },
      ],
    },
  };
};

const generateCropData = () => {
  return [
    {
      id: "rice",
      name: "Rice",
      season: "Kharif",
      waterNeed: "High",
      growthTime: "120 days",
      sustainability: 3,
      icon: "🌾",
      description: "Staple food crop, requires plenty of water",
    },
    {
      id: "tomato",
      name: "Tomato",
      season: "Rabi",
      waterNeed: "Medium",
      growthTime: "90 days",
      sustainability: 4,
      icon: "🍅",
      description: "Popular vegetable crop, good for small farms",
    },
    {
      id: "spinach",
      name: "Spinach",
      season: "Zaid",
      waterNeed: "Medium",
      growthTime: "45 days",
      sustainability: 4,
      icon: "🥬",
      description: "Fast-growing leafy green, high nutritional value",
    },
    {
      id: "wheat",
      name: "Wheat",
      season: "Rabi",
      waterNeed: "Medium",
      growthTime: "140 days",
      sustainability: 3,
      icon: "🌾",
      description: "Major cereal crop, versatile and nutritious",
    },
    {
      id: "corn",
      name: "Corn",
      season: "Kharif",
      waterNeed: "High",
      growthTime: "100 days",
      sustainability: 2,
      icon: "🌽",
      description: "High-yield crop, multiple uses",
    },
  ];
};

const generateFertilizerData = () => {
  return [
    {
      id: "organic_compost",
      name: "Organic Compost",
      type: "Organic",
      npk: "2-1-1",
      sustainability: 5,
      description: "Rich in organic matter, improves soil structure",
    },
    {
      id: "vermicompost",
      name: "Vermicompost",
      type: "Organic",
      npk: "3-1-2",
      sustainability: 5,
      description: "Nutrient-rich organic fertilizer from earthworms",
    },
    {
      id: "bone_meal",
      name: "Bone Meal",
      type: "Organic",
      npk: "3-15-0",
      sustainability: 4,
      description: "High in phosphorus, promotes root development",
    },
    {
      id: "chemical_npk",
      name: "NPK Fertilizer",
      type: "Chemical",
      npk: "10-10-10",
      sustainability: 2,
      description: "Balanced chemical fertilizer for quick results",
    },
  ];
};

const generateCommunityData = () => {
  return {
    posts: [
      {
        id: 1,
        user: "EcoWarrior",
        title: "Tips for water conservation",
        content:
          "I've reduced my water usage by 30% using drip irrigation and mulching. Here's how...",
        time: "2 hours ago",
        likes: 24,
        comments: 8,
      },
      {
        id: 2,
        user: "GreenThumb",
        title: "Organic pest control methods",
        content:
          "Instead of chemical pesticides, try neem oil spray. It's effective and eco-friendly!",
        time: "5 hours ago",
        likes: 18,
        comments: 5,
      },
      {
        id: 3,
        user: "SustainableSam",
        title: "Co-op meeting this Saturday",
        content:
          "We'll be discussing the new equipment sharing program. All members are encouraged to attend.",
        time: "1 day ago",
        likes: 12,
        comments: 3,
      },
    ],
    chatMessages: [
      {
        id: 1,
        user: "EcoWarrior",
        text: "Has anyone tried the new organic fertilizer?",
        time: "10:30 AM",
      },
      {
        id: 2,
        user: "GreenThumb",
        text: "Yes! I used it last week and my tomatoes are looking great",
        time: "10:32 AM",
      },
      {
        id: 3,
        user: "SustainableSam",
        text: "Where can I get it?",
        time: "10:35 AM",
      },
      {
        id: 4,
        user: "EcoWarrior",
        text: "You can buy it from the co-op store",
        time: "10:36 AM",
      },
    ],
  };
};

module.exports = {
  generateFarmData,
  generateWeatherData,
  generateGameData,
  generateCropData,
  generateFertilizerData,
  generateCommunityData,
};
