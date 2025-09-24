const express = require("express");
const router = express.Router();
const mockFarmData = require("../data/mockFarmData");
const mockWeatherData = require("../data/mockWeatherData");
const mockGameData = require("../data/mockGameData");

// Moisture sensor data storage
let moistureData = {
  value: 0,
  timestamp: new Date().toISOString(),
};
let moistureHistory = []; // Store last 50 readings

// ESP sensor data storage
let espSensorData = {
  distance: 0,
  timestamp: new Date().toISOString(),
  sensorId: 'ESP8266_ULTRASONIC'
};
let espSensorHistory = []; // Store last 100 readings

// Farm data endpoints
router.get("/farm-data", (req, res) => {
  setTimeout(() => {
    res.json(mockFarmData);
  }, 800);
});

// Weather data endpoints
router.get("/weather-data", (req, res) => {
  setTimeout(() => {
    res.json(mockWeatherData);
  }, 600);
});

// Game data endpoints
router.get("/game-data", (req, res) => {
  setTimeout(() => {
    res.json(mockGameData);
  }, 500);
});

// Player data endpoint
router.get("/player-data", (req, res) => {
  setTimeout(() => {
    res.json(mockGameData.player);
  }, 400);
});

// Quests endpoints
router.get("/quests", (req, res) => {
  setTimeout(() => {
    res.json(mockGameData.quests);
  }, 450);
});

// Coops endpoints
router.get("/coops", (req, res) => {
  setTimeout(() => {
    res.json(mockGameData.coops);
  }, 550);
});

// Economy endpoints
router.get("/economy", (req, res) => {
  setTimeout(() => {
    res.json(mockGameData.economy);
  }, 500);
});

// Leaderboard endpoints
router.get("/leaderboard", (req, res) => {
  const type = req.query.type || "weekly";
  setTimeout(() => {
    if (mockGameData.leaderboard[type]) {
      res.json(mockGameData.leaderboard[type]);
    } else {
      res.status(404).json({ error: "Leaderboard type not found" });
    }
  }, 600);
});

// Events endpoints
router.get("/events", (req, res) => {
  setTimeout(() => {
    res.json(mockGameData.events);
  }, 400);
});

// ===== NEW MOISTURE SENSOR ENDPOINTS =====

// POST endpoint for NodeMCU to send moisture data
router.post("/moisture", (req, res) => {
  const { value } = req.body;

  // Validate input
  if (typeof value !== "number" || value < 0 || value > 1024) {
    return res.status(400).json({
      error: "Invalid moisture value. Must be between 0-1024",
    });
  }

  // Update current data
  moistureData = {
    value,
    timestamp: new Date().toISOString(),
  };

  // Add to history (keep last 50 readings)
  moistureHistory.push({ ...moistureData });
  if (moistureHistory.length > 50) {
    moistureHistory.shift();
  }

  console.log("Received moisture data:", moistureData);
  setTimeout(() => {
    res.json({
      success: true,
      message: "Moisture data received",
      data: moistureData,
    });
  }, 300);
});

// GET endpoint for latest moisture data
router.get("/moisture", (req, res) => {
  setTimeout(() => {
    res.json(moistureData);
  }, 200);
});

// GET endpoint for moisture history
router.get("/moisture/history", (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const history = moistureHistory.slice(-limit);

  setTimeout(() => {
    res.json({
      data: history,
      count: history.length,
    });
  }, 250);
});

// ===== ESP SENSOR ENDPOINTS =====

// POST endpoint for ESP8266 to send distance data
router.post("/esp-sensor", (req, res) => {
  const { distance } = req.body;

  // Validate input
  if (typeof distance !== "number" || distance < 0) {
    return res.status(400).json({
      error: "Invalid distance value. Must be a positive number",
    });
  }

  // Update current data
  espSensorData = {
    distance,
    timestamp: new Date().toISOString(),
    sensorId: 'ESP8266_ULTRASONIC'
  };

  // Add to history (keep last 100 readings)
  espSensorHistory.push({ ...espSensorData });
  if (espSensorHistory.length > 100) {
    espSensorHistory.shift();
  }

  console.log("Received ESP sensor data:", espSensorData);
  res.json({
    success: true,
    message: "Distance data received successfully",
    data: espSensorData,
  });
});

// GET endpoint for latest ESP sensor data
router.get("/esp-sensor", (req, res) => {
  res.json({
    success: true,
    data: espSensorData
  });
});

// GET endpoint for ESP sensor history
router.get("/esp-sensor/history", (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const history = espSensorHistory.slice(-limit);

  res.json({
    success: true,
    data: history,
    count: history.length,
    totalReadings: espSensorHistory.length
  });
});

// GET endpoint for ESP sensor statistics
router.get("/esp-sensor/stats", (req, res) => {
  if (espSensorHistory.length === 0) {
    return res.json({
      success: true,
      data: {
        totalReadings: 0,
        averageDistance: 0,
        minDistance: 0,
        maxDistance: 0,
        lastReading: null
      }
    });
  }

  const distances = espSensorHistory.map(reading => reading.distance);
  const averageDistance = distances.reduce((sum, dist) => sum + dist, 0) / distances.length;
  const minDistance = Math.min(...distances);
  const maxDistance = Math.max(...distances);

  res.json({
    success: true,
    data: {
      totalReadings: espSensorHistory.length,
      averageDistance: parseFloat(averageDistance.toFixed(2)),
      minDistance,
      maxDistance,
      lastReading: espSensorData
    }
  });
});

// ===== EXISTING ENDPOINTS CONTINUE =====

// Update farm data endpoint
router.post("/update-farm", (req, res) => {
  console.log("Received farm update:", req.body);
  setTimeout(() => {
    res.json({ success: true, message: "Farm data updated successfully" });
  }, 500);
});

// Complete quest endpoint
router.post("/complete-quest", (req, res) => {
  const { questId } = req.body;
  console.log(`Completing quest: ${questId}`);
  setTimeout(() => {
    res.json({
      success: true,
      message: "Quest completed successfully",
      rewards: { coins: 50, experience: 30 },
    });
  }, 700);
});

// Join coop endpoint
router.post("/join-coop", (req, res) => {
  const { coopId } = req.body;
  console.log(`Joining coop: ${coopId}`);
  setTimeout(() => {
    res.json({
      success: true,
      message: "Successfully joined cooperative",
      coop: mockGameData.coops.playerCoop,
    });
  }, 800);
});

// Purchase item endpoint
router.post("/purchase", (req, res) => {
  const { itemId, quantity = 1 } = req.body;
  console.log(`Purchasing item: ${itemId}, quantity: ${quantity}`);
  setTimeout(() => {
    res.json({
      success: true,
      message: "Purchase successful",
      newBalance: { coins: 800, gems: 12 },
    });
  }, 600);
});

module.exports = router;
