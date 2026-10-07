import React from "react";
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Cloud
} from "lucide-react";

export default function WeatherIcon({ iconCode, condition, className = "w-8 h-8", size = 28 }) {
  const code = (iconCode || "").toLowerCase();
  const cond = (condition || "").toLowerCase();

  if (code === "01d") return <Sun size={size} className={`text-amber-400 ${className}`} />;
  if (code === "01n") return <Moon size={size} className={`text-indigo-200 ${className}`} />;
  if (code === "02d") return <CloudSun size={size} className={`text-amber-300 ${className}`} />;
  if (code === "02n") return <CloudMoon size={size} className={`text-indigo-300 ${className}`} />;
  if (code === "03d" || code === "03n" || code === "04d" || code === "04n" || cond.includes("cloud")) {
    return <Cloud size={size} className={`text-slate-200 ${className}`} />;
  }
  if (code === "09d" || code === "09n" || cond.includes("drizzle")) {
    return <CloudDrizzle size={size} className={`text-cyan-300 ${className}`} />;
  }
  if (code === "10d" || code === "10n" || cond.includes("rain")) {
    return <CloudRain size={size} className={`text-blue-300 ${className}`} />;
  }
  if (code === "11d" || code === "11n" || cond.includes("thunder") || cond.includes("storm")) {
    return <CloudLightning size={size} className={`text-yellow-300 ${className}`} />;
  }
  if (code === "13d" || code === "13n" || cond.includes("snow")) {
    return <CloudSnow size={size} className={`text-sky-100 ${className}`} />;
  }
  if (code === "50d" || code === "50n" || cond.includes("mist") || cond.includes("fog") || cond.includes("haze")) {
    return <CloudFog size={size} className={`text-teal-200 ${className}`} />;
  }

  return <Sun size={size} className={`text-amber-400 ${className}`} />;
}

