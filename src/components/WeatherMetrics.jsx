import React from "react";
import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  Cloud,
  Sunrise,
  Sunset,
  Compass
} from "lucide-react";
import { formatWindSpeed, formatTime } from "../utils/weatherHelpers";

export default function WeatherMetrics({ weatherData, unit }) {
  if (!weatherData || !weatherData.current) return null;

  const { current } = weatherData;
  const main = current.main || {};
  const wind = current.wind || {};
  const sys = current.sys || {};
  const clouds = current.clouds || {};
  const visibility = current.visibility; // in meters

  const metrics = [
    {
      id: "humidity",
      label: "Humidity",
      value: `${main.humidity ?? "--"}%`,
      subtext: main.humidity > 65 ? "High humidity" : main.humidity < 35 ? "Dry air" : "Comfortable",
      icon: <Droplets className="metric-icon humidity" size={22} />
    },
    {
      id: "wind",
      label: "Wind Speed",
      value: formatWindSpeed(wind.speed, unit),
      subtext: wind.deg !== undefined ? `${wind.deg}° wind direction` : "Gentle breeze",
      icon: <Wind className="metric-icon wind" size={22} />
    },
    {
      id: "pressure",
      label: "Pressure",
      value: `${main.pressure ?? "--"} hPa`,
      subtext: main.pressure > 1013 ? "High pressure" : "Low pressure",
      icon: <Gauge className="metric-icon pressure" size={22} />
    },
    {
      id: "visibility",
      label: "Visibility",
      value: visibility !== undefined ? `${(visibility / 1000).toFixed(1)} km` : "--",
      subtext: visibility && visibility >= 10000 ? "Clear view" : "Reduced visibility",
      icon: <Eye className="metric-icon visibility" size={22} />
    },
    {
      id: "clouds",
      label: "Cloudiness",
      value: `${clouds.all ?? "--"}%`,
      subtext: clouds.all > 70 ? "Overcast sky" : clouds.all < 20 ? "Clear sky" : "Partly cloudy",
      icon: <Cloud className="metric-icon clouds" size={22} />
    },
    {
      id: "sun",
      label: "Sunrise & Sunset",
      value: `${formatTime(sys.sunrise, current.timezone)} / ${formatTime(sys.sunset, current.timezone)}`,
      subtext: "Dawn & Dusk (Local)",
      icon: <Sunrise className="metric-icon sun" size={22} />
    }
  ];

  return (
    <div className="metrics-grid">
      {metrics.map((m) => (
        <div key={m.id} className="metric-card">
          <div className="metric-header">
            <span className="metric-label">{m.label}</span>
            {m.icon}
          </div>
          <div className="metric-value">{m.value}</div>
          <div className="metric-subtext">{m.subtext}</div>
        </div>
      ))}
    </div>
  );
}

