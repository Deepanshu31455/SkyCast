import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import WeatherMetrics from "./components/WeatherMetrics";
import Forecast from "./components/Forecast";
import RecentSearches from "./components/RecentSearches";
import {
  fetchWeatherByCity,
  fetchCurrentWeatherByCoords,
  fetchForecastByCoords
} from "./services/weatherApi";
import { getWeatherTheme } from "./utils/weatherHelpers";
import {
  CloudSun,
  RefreshCw,
  AlertCircle,
  Loader2,
  Sparkles
} from "lucide-react";
import "./App.css";

const RECENT_KEY = "skycast_recent_cities";
const LAST_SEARCH_KEY = "skycast_last_query";

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("metric"); // 'metric' (°C) or 'imperial' (°F)
  const [recentCities, setRecentCities] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      return saved ? JSON.parse(saved) : ["London", "Tokyo", "New York", "Paris"];
    } catch {
      return ["London", "Tokyo", "New York", "Paris"];
    }
  });

  const saveRecentCity = useCallback((city) => {
    if (!city) return;
    setRecentCities((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== city.toLowerCase());
      const updated = [city, ...filtered].slice(0, 6);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  const loadWeatherByCity = useCallback(
    async (cityName, currentUnit = unit) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWeatherByCity(cityName, currentUnit);
        setWeatherData(data);
        saveRecentCity(data.location.name);
        try {
          localStorage.setItem(LAST_SEARCH_KEY, data.location.name);
        } catch {}
      } catch (err) {
        setError(err.message || "Failed to load weather data. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [unit, saveRecentCity]
  );

  const loadWeatherByCoords = useCallback(
    async (lat, lon, currentUnit = unit) => {
      setLoading(true);
      setError(null);
      try {
        const [current, forecast] = await Promise.all([
          fetchCurrentWeatherByCoords(lat, lon, currentUnit),
          fetchForecastByCoords(lat, lon, currentUnit).catch(() => null)
        ]);

        const data = {
          current,
          forecast,
          location: {
            name: current.name,
            country: current.sys?.country || "",
            lat,
            lon
          }
        };
        setWeatherData(data);
        saveRecentCity(current.name);
        try {
          localStorage.setItem(LAST_SEARCH_KEY, current.name);
        } catch {}
      } catch (err) {
        setError(err.message || "Failed to load weather for your location.");
      } finally {
        setLoading(false);
      }
    },
    [unit, saveRecentCity]
  );

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoadingLocation(false);
        loadWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (geoError) => {
        setLoadingLocation(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError("Location access was denied. Search for your city manually above.");
        } else {
          setError("Unable to retrieve your location. Please search manually.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleUnitToggle = () => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);
    if (weatherData?.location) {
      const { lat, lon } = weatherData.location;
      if (lat !== undefined && lon !== undefined) {
        loadWeatherByCoords(lat, lon, newUnit);
      } else if (weatherData.location.name) {
        loadWeatherByCity(weatherData.location.name, newUnit);
      }
    }
  };

  const handleRefresh = () => {
    if (weatherData?.location) {
      const { lat, lon, name } = weatherData.location;
      if (lat !== undefined && lon !== undefined) {
        loadWeatherByCoords(lat, lon);
      } else if (name) {
        loadWeatherByCity(name);
      }
    } else {
      loadWeatherByCity("London");
    }
  };

  const handleClearHistory = () => {
    setRecentCities([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {}
  };

  // Initial load
  useEffect(() => {
    const lastCity = localStorage.getItem(LAST_SEARCH_KEY);
    if (lastCity) {
      loadWeatherByCity(lastCity);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          loadWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          loadWeatherByCity("London");
        },
        { timeout: 5000 }
      );
    } else {
      loadWeatherByCity("London");
    }
  }, []);

  const currentWeatherCond = weatherData?.current?.weather?.[0];
  const themeClass = weatherData
    ? getWeatherTheme(currentWeatherCond?.icon, currentWeatherCond?.main)
    : "theme-default";

  return (
    <div className={`app-container ${themeClass}`}>
      <div className="app-backdrop-glow"></div>
      
      <div className="app-content-wrapper">
        {/* Top Navigation Bar */}
        <header className="app-header">
          <div className="brand">
            <div className="brand-icon-wrapper">
              <CloudSun className="brand-icon" size={26} />
            </div>
            <div className="brand-text">
              <h1 className="brand-title">SkyCast</h1>
              <span className="brand-subtitle">Real-time Weather Intelligence</span>
            </div>
          </div>

          <div className="header-actions">
            <button
              className="unit-toggle-btn"
              onClick={handleUnitToggle}
              title={`Switch to ${unit === "metric" ? "Fahrenheit (°F)" : "Celsius (°C)"}`}
            >
              <span className={unit === "metric" ? "unit-active" : ""}>°C</span>
              <span className="unit-divider">/</span>
              <span className={unit === "imperial" ? "unit-active" : ""}>°F</span>
            </button>

            <button
              className="action-icon-btn"
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh weather data"
            >
              <RefreshCw className={loading ? "animate-spin" : ""} size={18} />
            </button>
          </div>
        </header>

        {/* Search Bar & Location Action */}
        <section className="search-section">
          <SearchBar
            onSearch={(city) => loadWeatherByCity(city)}
            onCurrentLocation={handleCurrentLocation}
            loadingLocation={loadingLocation}
          />

          <RecentSearches
            recentCities={recentCities}
            onSelectCity={(city) => loadWeatherByCity(city)}
            onClearHistory={handleClearHistory}
          />
        </section>

        {/* Error Notification */}
        {error && (
          <div className="error-banner">
            <AlertCircle size={20} className="error-icon" />
            <p className="error-text">{error}</p>
            <button className="error-close-btn" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        )}

        {/* Loading Spinner Skeleton */}
        {loading && !weatherData && (
          <div className="main-loading-state">
            <Loader2 className="animate-spin text-sky-400" size={44} />
            <p className="loading-text">Fetching current weather conditions...</p>
          </div>
        )}

        {/* Main Weather Dashboard */}
        {weatherData && (
          <main className={`weather-dashboard ${loading ? "dashboard-dimmed" : ""}`}>
            <div className="dashboard-grid">
              {/* Left Column: Current Weather Overview */}
              <div className="dashboard-left">
                <CurrentWeather weatherData={weatherData} unit={unit} />
                <WeatherMetrics weatherData={weatherData} unit={unit} />
              </div>

              {/* Right Column: 24h & 5-Day Forecast */}
              <div className="dashboard-right">
                <Forecast
                  forecastData={weatherData.forecast}
                  timezoneOffset={weatherData.current?.timezone || 0}
                  unit={unit}
                />
              </div>
            </div>
          </main>
        )}

        {/* Footer */}
        <footer className="app-footer">
          <p>
            Powered by <strong>OpenWeatherMap API</strong> • Built with <strong>React & Vite</strong>
          </p>
        </footer>
      </div>
    </div>
  );
}

