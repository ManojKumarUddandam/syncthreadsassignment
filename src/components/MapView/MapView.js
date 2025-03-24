import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './MapView.css';
import MapUpdater from './MapUpdater';

const MapView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const viewType = queryParams.get('view') || 'world';

  const [mapConfig, setMapConfig] = useState({ center: [20.5937, 78.9629], zoom: 3 });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const customIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const updateMapView = async () => {
      setLoading(true);
      setError('');

      try {
        if (viewType === 'current') {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setMapConfig({ center: [latitude, longitude], zoom: 12 });
              setSelectedLocation({ lat: latitude, lon: longitude, name: 'Your Location' });
              setLoading(false);
            },
            () => {
              setError('Unable to retrieve your location.');
              setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
        } else {
          setMapConfig({ center: [20.5937, 78.9629], zoom: 3 });
          setLoading(false);
        }
      } catch {
        setError('Error loading map data.');
        setLoading(false);
      }
    };

    updateMapView();
  }, [viewType, navigate]);

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setError('Please enter a city name.');
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&addressdetails=1&limit=5`,
        { headers: { 'Accept-Language': 'en' } }
      );
      setSuggestions(response.data);
    } catch {
      setError('Error fetching city suggestions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = (lat, lon, name) => {
    setMapConfig({ center: [parseFloat(lat), parseFloat(lon)], zoom: 12 });
    setSelectedLocation({ lat, lon, name });
    setSuggestions([]);
    setSearchQuery(name);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setError('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
        Map View
      </h1>

      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="clear-button"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="search-button"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="suggestions-wrapper">
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="suggestion-item"
                onClick={() => handleSelectCity(suggestion.lat, suggestion.lon, suggestion.display_name)}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="map-container">
        <MapContainer
          center={mapConfig.center}
          zoom={mapConfig.zoom}
          className="map"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapUpdater center={mapConfig.center} zoom={mapConfig.zoom} />
          {selectedLocation && (
            <Marker 
              position={[parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lon)]} 
              icon={customIcon}
            >
              <Popup>{selectedLocation.name}</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;