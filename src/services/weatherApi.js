const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "4faf818758e90a77efee323d34a0114e";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

export async function fetchCurrentWeatherByCoords(lat, lon, units = "metric") {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchForecastByCoords(lat, lon, units = "metric") {
  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch forecast: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchGeoCoordinates(city) {
  const response = await fetch(
    `${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=5&appid=${API_KEY}`
  );
  if (!response.ok) {
    throw new Error(`Failed to geocode city: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

export async function fetchWeatherByCity(city, units = "metric") {
  const geoData = await fetchGeoCoordinates(city);
  if (!geoData || geoData.length === 0) {
    // Try direct weather query as fallback
    const directRes = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`
    );
    if (!directRes.ok) {
      throw new Error(`City "${city}" not found. Please check spelling.`);
    }
    const weather = await directRes.json();
    const forecast = await fetchForecastByCoords(weather.coord.lat, weather.coord.lon, units).catch(() => null);
    return {
      current: weather,
      forecast,
      location: {
        name: weather.name,
        country: weather.sys?.country || "",
        lat: weather.coord.lat,
        lon: weather.coord.lon
      }
    };
  }

  const { lat, lon, name, country, state } = geoData[0];
  const [current, forecast] = await Promise.all([
    fetchCurrentWeatherByCoords(lat, lon, units),
    fetchForecastByCoords(lat, lon, units).catch(() => null)
  ]);

  return {
    current,
    forecast,
    location: {
      name,
      country,
      state,
      lat,
      lon
    }
  };
}

