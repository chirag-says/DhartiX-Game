import React from "react";
import Card from "../common/Card";
import "./WeatherWidget.css";

const WeatherWidget = ({ weatherData }) => {
  if (!weatherData) return <div>Loading weather data...</div>;

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return "☀️";
      case "partly cloudy":
        return "⛅";
      case "cloudy":
        return "☁️";
      case "rainy":
        return "🌧️";
      case "stormy":
        return "⛈️";
      default:
        return "🌤️";
    }
  };

  return (
    <Card className="weather-widget">
      <div className="card-header">
        <h2 className="card-title">Weather</h2>
      </div>

      <div className="current-weather">
        <div className="weather-icon">
          {getWeatherIcon(weatherData.current.condition)}
        </div>
        <div className="weather-details">
          <div className="temperature">{weatherData.current.temperature}°C</div>
          <div className="condition">{weatherData.current.condition}</div>
        </div>
      </div>

      <div className="weather-stats">
        <div className="stat-item">
          <span className="stat-label">Humidity</span>
          <span className="stat-value">{weatherData.current.humidity}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Wind</span>
          <span className="stat-value">
            {weatherData.current.windSpeed} km/h
          </span>
        </div>
      </div>

      <div className="forecast">
        <h3 className="forecast-title">5-Day Forecast</h3>
        <div className="forecast-list">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="forecast-item">
              <span className="day">{day.day}</span>
              <span className="forecast-icon">
                {getWeatherIcon(day.condition)}
              </span>
              <span className="temp">{day.temperature}°</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default WeatherWidget;
