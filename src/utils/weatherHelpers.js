export function formatTemperature(temp, unit = "metric") {
  if (temp === undefined || temp === null) return "--";
  const rounded = Math.round(temp);
  return `${rounded}°${unit === "metric" ? "C" : "F"}`;
}

export function formatWindSpeed(speed, unit = "metric") {
  if (speed === undefined || speed === null) return "--";
  return unit === "metric" ? `${Math.round(speed * 3.6)} km/h` : `${Math.round(speed)} mph`;
}

export function formatTime(timestamp, timezoneOffset = 0) {
  if (!timestamp) return "--";
  // timestamp is in seconds, timezoneOffset is in seconds
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.toUTCString().slice(17, 22);
}

export function formatDate(timestamp, timezoneOffset = 0) {
  if (!timestamp) return "--";
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  });
}

export function getWeatherTheme(iconCode, mainCondition = "") {
  const code = (iconCode || "").toLowerCase();
  const main = (mainCondition || "").toLowerCase();

  if (code.startsWith("01")) {
    // Clear sky
    return code.endsWith("d") ? "theme-sunny" : "theme-clear-night";
  }
  if (code.startsWith("02") || code.startsWith("03") || code.startsWith("04") || main.includes("cloud")) {
    return code.endsWith("n") ? "theme-cloudy-night" : "theme-cloudy";
  }
  if (code.startsWith("09") || code.startsWith("10") || main.includes("rain") || main.includes("drizzle")) {
    return "theme-rainy";
  }
  if (code.startsWith("11") || main.includes("thunder")) {
    return "theme-storm";
  }
  if (code.startsWith("13") || main.includes("snow")) {
    return "theme-snow";
  }
  if (code.startsWith("50") || main.includes("mist") || main.includes("fog") || main.includes("haze")) {
    return "theme-fog";
  }
  return "theme-default";
}

export function processForecastData(forecastList) {
  if (!forecastList || !Array.isArray(forecastList)) return { daily: [], hourly: [] };

  // Hourly: next 8 entries (24 hours in 3h steps)
  const hourly = forecastList.slice(0, 8);

  // Daily: aggregate by date
  const dailyMap = {};
  forecastList.forEach((item) => {
    const date = item.dt_txt ? item.dt_txt.split(" ")[0] : new Date(item.dt * 1000).toISOString().split("T")[0];
    if (!dailyMap[date]) {
      dailyMap[date] = {
        dt: item.dt,
        date,
        temps: [],
        weather: item.weather[0],
        humidity: [],
        wind: []
      };
    }
    dailyMap[date].temps.push(item.main.temp);
    dailyMap[date].humidity.push(item.main.humidity);
    dailyMap[date].wind.push(item.wind.speed);
  });

  const daily = Object.values(dailyMap).map((day) => ({
    dt: day.dt,
    date: day.date,
    minTemp: Math.min(...day.temps),
    maxTemp: Math.max(...day.temps),
    weather: day.weather,
    avgHumidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
    avgWind: Math.round(day.wind.reduce((a, b) => a + b, 0) / day.wind.length)
  }));

  return { daily, hourly };
}

