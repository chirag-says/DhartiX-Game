import React, { useState, useEffect } from "react";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import FarmOverview from "./components/dashboard/FarmOverview";
import WeatherWidget from "./components/dashboard/WeatherWidget";
import SoilMoistureWidget from "./components/dashboard/SoilMoistureWidget";
import CropHealthWidget from "./components/dashboard/CropHealthWidget";
import ResourceMonitor from "./components/dashboard/ResourceMonitor";
import Quests from "./components/game/Quests";
import Achievements from "./components/game/Achievements";
import Leaderboard from "./components/game/Leaderboard";
import Rewards from "./components/game/Rewards";
import FieldPlanner from "./components/farm/FieldPlanner";
import CropSelector from "./components/farm/CropSelector";
import IrrigationControl from "./components/farm/IrrigationControl";
import FertilizerControl from "./components/farm/FertilizerControl";
import CoopManagement from "./components/social/CoopManagement";
import Chat from "./components/social/Chat";
import CommunityBoard from "./components/social/CommunityBoard";
import GreenTwinGame from "./components/game/GreenTwinGame";
import { getFarmData, getWeatherData } from "./services/apiService";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("game"); // Set game as default tab
  const [farmData, setFarmData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const farm = await getFarmData();
        const weather = await getWeatherData();
        setFarmData(farm);
        setWeatherData(weather);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderDashboard = () => (
    <div className="dashboard-grid">
      <FarmOverview farmData={farmData} />
      <WeatherWidget weatherData={weatherData} />
      <SoilMoistureWidget moistureLevel={farmData?.soilMoisture || 0} />
      <CropHealthWidget healthLevel={farmData?.cropHealth || 0} />
      <ResourceMonitor />
    </div>
  );

  const renderGameElements = () => (
    <div className="game-grid">
      <Quests />
      <Achievements />
      <Leaderboard />
      <Rewards />
    </div>
  );

  const renderFarmManagement = () => (
    <div className="farm-grid">
      <FieldPlanner />
      <CropSelector />
      <IrrigationControl />
      <FertilizerControl />
    </div>
  );

  const renderSocialFeatures = () => (
    <div className="social-grid">
      <CoopManagement />
      <Chat />
      <CommunityBoard />
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Green-Twin Platform...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <div className="main-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="content">
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "farm" && renderFarmManagement()}
          {activeTab === "game" && <GreenTwinGame />}
          {activeTab === "social" && renderSocialFeatures()}
        </main>
      </div>
    </div>
  );
}

export default App;
