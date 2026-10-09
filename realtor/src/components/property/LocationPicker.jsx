import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { MdLocationOn, MdMyLocation, MdSearch } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";

// Fix Leaflet default marker icons broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Moves map view when coords change from geocoding
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 16);
  }, [lat, lng, map]);
  return null;
};

// Handles click-to-drop-pin on the map
const ClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Default center — India
const DEFAULT_CENTER = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;

// Custom styled zoom buttons
const CustomZoomControl = () => {
  const map = useMap();
  const btnStyle = {
    width: 36, height: 36,
    background: "#fff",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
    fontSize: 20, fontWeight: 600,
    color: "#3A76DA",
    boxShadow: "0 2px 8px rgba(58,118,218,0.10)",
    transition: "background 0.15s, color 0.15s, box-shadow 0.15s",
    userSelect: "none",
    lineHeight: 1,
  };
  const hoverIn  = e => { e.currentTarget.style.background = "#3A76DA"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(58,118,218,0.22)"; };
  const hoverOut = e => { e.currentTarget.style.background = "#fff";    e.currentTarget.style.color = "#3A76DA"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(58,118,218,0.10)"; };
  return (
    <div style={{ position: "absolute", bottom: 24, right: 14, zIndex: 1000, display: "flex", flexDirection: "column", gap: 6 }}>
      <button style={btnStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut} onClick={() => map.zoomIn()}>+</button>
      <button style={btnStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut} onClick={() => map.zoomOut()}>−</button>
    </div>
  );
};

const LocationPicker = ({ address, latitude, longitude, onChange }) => {
  const [searchQuery, setSearchQuery] = useState(address || "");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");

  const hasCoords =
    latitude != null && longitude != null &&
    !isNaN(Number(latitude)) && !isNaN(Number(longitude));

  const lat = hasCoords ? Number(latitude) : null;
  const lng = hasCoords ? Number(longitude) : null;

  const geocode = async (query) => {
    if (!query.trim()) return;
    setIsGeocoding(true);
    setGeocodeError("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const results = await res.json();
      if (results.length === 0) {
        setGeocodeError("Location not found. Try a more specific address or city name.");
        return;
      }
      onChange({
        latitude: parseFloat(results[0].lat),
        longitude: parseFloat(results[0].lon),
      });
    } catch {
      setGeocodeError("Could not fetch location. Please check your connection.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    geocode(searchQuery);
  };

  const handleAutoLocate = () => {
    const q = address || searchQuery;
    if (q) {
      setSearchQuery(q);
      geocode(q);
    }
  };

  const handleMapClick = (clickLat, clickLng) => {
    onChange({ latitude: clickLat, longitude: clickLng });
  };

  return (
    <div className="md:col-span-2 font-Poppins">
      <label className="text-xs font-bold text-ash uppercase tracking-wide mb-1.5 block">
        Pin Location on Map
      </label>
      <p className="text-xs text-ash mb-3">
        Search your address to auto-locate, or click anywhere on the map to drop a pin manually.
      </p>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ash text-base" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search address, landmark or city..."
            className="border border-silver rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:border-blue w-full bg-white transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isGeocoding}
          className="bg-blue text-white text-sm font-bold px-5 py-3 rounded-xl hover:bg-liteBlue transition-colors disabled:opacity-50 flex items-center gap-2 flex-shrink-0"
        >
          <MdLocationOn className="text-base" />
          {isGeocoding ? "Locating..." : "Find"}
        </button>
        <button
          type="button"
          onClick={handleAutoLocate}
          title="Use the address entered above"
          className="border border-silver bg-silverLite text-ash text-sm font-medium px-4 py-3 rounded-xl hover:border-blue hover:text-blue transition-colors flex items-center gap-1.5 flex-shrink-0"
        >
          <MdMyLocation className="text-base" />
          <span className="hidden sm:inline">Auto</span>
        </button>
      </form>

      {geocodeError && (
        <p className="text-xs mb-3 px-3 py-2 rounded-lg bg-silverLite" style={{ color: "#dc2626" }}>
          {geocodeError}
        </p>
      )}

      {/* Status bar */}
      {hasCoords && (
        <div className="flex items-center gap-2 mb-2 text-xs text-ash">
          <HiOutlineLocationMarker className="text-blue text-sm flex-shrink-0" />
          <span>
            Pinned at {lat.toFixed(5)}, {lng.toFixed(5)}
          </span>
          <span
            className="font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#dcfce7", color: "#15803d" }}
          >
            ✓ Set
          </span>
          <a
            href={`https://www.google.com/maps?q=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-blue hover:underline"
          >
            Open in Maps ↗
          </a>
        </div>
      )}

      {/* Leaflet map */}
      <div
        className="rounded-2xl overflow-hidden border border-silver"
        style={{ height: "300px", width: "100%" }}
      >
        <MapContainer
          center={hasCoords ? [lat, lng] : DEFAULT_CENTER}
          zoom={hasCoords ? 16 : DEFAULT_ZOOM}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {hasCoords && <RecenterMap lat={lat} lng={lng} />}
          <CustomZoomControl />
          <ClickHandler onMapClick={handleMapClick} />
          {hasCoords && <Marker position={[lat, lng]} />}
        </MapContainer>
      </div>

      <p className="text-xs text-ash mt-2">
        💡 Click anywhere on the map to move the pin to an exact location.
      </p>
    </div>
  );
};

export default LocationPicker;
