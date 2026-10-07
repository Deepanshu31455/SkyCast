import React from "react";
import { History, X } from "lucide-react";

export default function RecentSearches({ recentCities, onSelectCity, onClearHistory }) {
  if (!recentCities || recentCities.length === 0) return null;

  return (
    <div className="recent-searches">
      <div className="recent-header">
        <span className="recent-title">
          <History size={15} /> Recent Searches
        </span>
        <button
          className="clear-history-btn"
          onClick={onClearHistory}
          title="Clear all recent searches"
        >
          Clear
        </button>
      </div>
      <div className="recent-chips">
        {recentCities.map((city, idx) => (
          <button
            key={`${city}-${idx}`}
            className="chip-btn"
            onClick={() => onSelectCity(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}

