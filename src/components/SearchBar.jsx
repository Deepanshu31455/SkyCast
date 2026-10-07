import React, { useState } from "react";
import { Search, MapPin, X, Loader2 } from "lucide-react";

export default function SearchBar({ onSearch, onCurrentLocation, loadingLocation }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search city, country (e.g. London, Tokyo, New York)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
              aria-label="Clear input"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <button type="submit" className="btn btn-primary search-submit-btn">
          Search
        </button>

        <button
          type="button"
          className="btn btn-secondary location-btn"
          onClick={onCurrentLocation}
          disabled={loadingLocation}
          title="Use current location"
        >
          {loadingLocation ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <MapPin size={18} />
          )}
          <span className="location-btn-text">My Location</span>
        </button>
      </form>
    </div>
  );
}

