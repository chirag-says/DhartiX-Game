const express = require("express");
const router = express.Router();
const mockFarmData = require("../data/mockFarmData");
const mockWeatherData = require("../data/mockWeatherData");
const mockGameData = require("../data/mockGameData");

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
