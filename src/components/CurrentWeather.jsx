import React from "react";
import WeatherIcon from "./WeatherIcon";
import { formatTemperature, formatDate, formatTime } from "../utils/weatherHelpers";
import { ArrowUp, ArrowDown, Thermometer } from "lucide-react";

export default function CurrentWeather({ weatherData, unit }) {
  if (!weatherData || !weatherData.current) return null;

  const { current, location } = weatherData;
  const weatherCond = current.weather && current.weather[0];
  const iconCode = weatherCond?.icon;
  const description = weatherCond?.description || weatherCond?.main;
  const temp = current.main?.temp;
  const feelsLike = current.main?.feels_like;
  const tempMin = current.main?.temp_min;
  const tempMax = current.main?.temp_max;

  const displayName = location?.name || current.name;
  const country = location?.country || current.sys?.country;
  const state = location?.state;

  return (
    <div className="current-weather-card">
      <div className="current-weather-header">
        <div className="location-info">
          <h2 className="location-name">
            {displayName}
            {country ? <span className="country-badge">{country}</span> : null}
          </h2>
          {state && <span className="state-name">{state}</span>}
          <p className="current-date">
            {formatDate(current.dt, current.timezone)} • {formatTime(current.dt, current.timezone)}
          </p>
        </div>
      </div>

      <div className="current-weather-body">
        <div className="temp-display-group">
          <div className="icon-wrapper-large">
            <WeatherIcon iconCode={iconCode} condition={weatherCond?.main} size={76} />
          </div>
          <div className="temp-values">
            <span className="current-temp">{formatTemperature(temp, unit)}</span>
            <span className="weather-desc">{description}</span>
          </div>
        </div>

        <div className="temp-extra-details">
          <div className="temp-detail-item">
            <Thermometer size={18} className="text-amber-400" />
            <span>Feels like <strong>{formatTemperature(feelsLike, unit)}</strong></span>
          </div>
          <div className="temp-minmax">
            <span className="minmax-item">
              <ArrowDown size={15} className="text-cyan-400" />
              Min: {formatTemperature(tempMin, unit)}
            </span>
            <span className="minmax-item">
              <ArrowUp size={15} className="text-rose-400" />
              Max: {formatTemperature(tempMax, unit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

