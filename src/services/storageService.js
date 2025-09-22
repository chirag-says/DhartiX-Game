// Local storage service for the prototype
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving to local storage:", error);
    return false;
  }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error("Error loading from local storage:", error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Error removing from local storage:", error);
    return false;
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing local storage:", error);
    return false;
  }
};

// Specific keys for the app
export const STORAGE_KEYS = {
  USER_PREFERENCES: "greenTwin_userPreferences",
  FARM_DATA: "greenTwin_farmData",
  GAME_PROGRESS: "greenTwin_gameProgress",
  SETTINGS: "greenTwin_settings",
};
