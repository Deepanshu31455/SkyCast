import React, { useState } from "react";
import WeatherIcon from "./WeatherIcon";
import { formatTemperature, formatTime, processForecastData } from "../utils/weatherHelpers";
import { Calendar, Clock, Droplets, Wind } from "lucide-react";

export default function Forecast({ forecastData, timezoneOffset = 0, unit }) {
  const [tab, setTab] = useState("hourly"); // "hourly" or "daily"

  if (!forecastData || !forecastData.list) return null;

  const { daily, hourly } = processForecastData(forecastData.list);

  return (
    <div className="forecast-card">
      <div className="forecast-header">
        <h3 className="forecast-title">Forecast</h3>
        <div className="forecast-tabs">
          <button
            className={`forecast-tab-btn ${tab === "hourly" ? "active" : ""}`}
            onClick={() => setTab("hourly")}
          >
            <Clock size={15} /> 24 Hours
          </button>
          <button
            className={`forecast-tab-btn ${tab === "daily" ? "active" : ""}`}
            onClick={() => setTab("daily")}
          >
            <Calendar size={15} /> 5 Days
          </button>
        </div>
      </div>

      {tab === "hourly" && (
        <div className="hourly-forecast-list">
          {hourly.map((item, idx) => {
            const timeStr = formatTime(item.dt, timezoneOffset);
            const weather = item.weather[0];
            return (
              <div key={item.dt || idx} className="hourly-item">
                <span className="hourly-time">{idx === 0 ? "Now" : timeStr}</span>
                <WeatherIcon
                  iconCode={weather.icon}
                  condition={weather.main}
                  size={32}
                  className="hourly-icon"
                />
                <span className="hourly-temp">{formatTemperature(item.main.temp, unit)}</span>
                <div className="hourly-meta">
                  <span title="Humidity">
                    <Droplets size={12} /> {item.main.humidity}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "daily" && (
        <div className="daily-forecast-list">
          {daily.map((day, idx) => {
            const dateObj = new Date(day.date);
            const dayName = idx === 0 ? "Today" : dateObj.toLocaleDateString("en-US", { weekday: "short" });
            const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });

            return (
              <div key={day.date} className="daily-item">
                <div className="daily-date-col">
                  <span className="daily-day">{dayName}</span>
                  <span className="daily-date-sub">{formattedDate}</span>
                </div>

                <div className="daily-weather-col">
                  <WeatherIcon
                    iconCode={day.weather.icon}
                    condition={day.weather.main}
                    size={28}
                  />
                  <span className="daily-desc">{day.weather.description}</span>
                </div>

                <div className="daily-details-col">
                  <span className="daily-meta-item" title="Average Humidity">
                    <Droplets size={13} /> {day.avgHumidity}%
                  </span>
                  <span className="daily-meta-item" title="Average Wind">
                    <Wind size={13} /> {day.avgWind} m/s
                  </span>
                </div>

                <div className="daily-temp-col">
                  <span className="daily-max">{formatTemperature(day.maxTemp, unit)}</span>
                  <span className="daily-min">{formatTemperature(day.minTemp, unit)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

