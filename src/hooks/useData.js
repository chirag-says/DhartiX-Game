import { useState, useEffect } from "react";
import {
  getFarmData,
  getWeatherData,
  getGameData,
} from "../services/apiService";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  STORAGE_KEYS,
} from "../services/storageService";

export const useData = () => {
  const [farmData, setFarmData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from API or local storage
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Try to get data from local storage first
        const cachedFarmData = loadFromLocalStorage(STORAGE_KEYS.FARM_DATA);
        const cachedWeatherData = loadFromLocalStorage(
          STORAGE_KEYS.WEATHER_DATA
        );
        const cachedGameData = loadFromLocalStorage(STORAGE_KEYS.GAME_PROGRESS);

        if (cachedFarmData) setFarmData(cachedFarmData);
        if (cachedWeatherData) setWeatherData(cachedWeatherData);
        if (cachedGameData) setGameData(cachedGameData);

        // Fetch fresh data from API
        const [freshFarmData, freshWeatherData, freshGameData] =
          await Promise.all([getFarmData(), getWeatherData(), getGameData()]);

        setFarmData(freshFarmData);
        setWeatherData(freshWeatherData);
        setGameData(freshGameData);

        // Save fresh data to local storage
        saveToLocalStorage(STORAGE_KEYS.FARM_DATA, freshFarmData);
        saveToLocalStorage(STORAGE_KEYS.WEATHER_DATA, freshWeatherData);
        saveToLocalStorage(STORAGE_KEYS.GAME_PROGRESS, freshGameData);

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to refresh data
  const refreshData = async () => {
    try {
      setLoading(true);

      const [freshFarmData, freshWeatherData, freshGameData] =
        await Promise.all([getFarmData(), getWeatherData(), getGameData()]);

      setFarmData(freshFarmData);
      setWeatherData(freshWeatherData);
      setGameData(freshGameData);

      // Save fresh data to local storage
      saveToLocalStorage(STORAGE_KEYS.FARM_DATA, freshFarmData);
      saveToLocalStorage(STORAGE_KEYS.WEATHER_DATA, freshWeatherData);
      saveToLocalStorage(STORAGE_KEYS.GAME_PROGRESS, freshGameData);

      setError(null);
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    farmData,
    weatherData,
    gameData,
    loading,
    error,
    refreshData,
  };
};
