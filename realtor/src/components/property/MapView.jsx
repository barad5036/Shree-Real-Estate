import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdLocationOff } from "react-icons/md";

// Fix Leaflet's default marker icon broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Helper to re-center map when coords change
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
};

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

const MapView = ({ latitude, longitude, address }) => {
  const hasCoords =
    latitude != null && longitude != null &&
    !isNaN(Number(latitude)) && !isNaN(Number(longitude));

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!hasCoords) {
    return (
      <div className="w-full rounded-2xl overflow-hidden border border-silver">
        <div className="bg-white px-4 py-3 flex items-center gap-2 border-b border-silver">
          <HiOutlineLocationMarker className="text-blue text-lg flex-shrink-0" />
          <span className="text-ash text-sm font-Poppins truncate">
            {address || "Address not provided"}
          </span>
        </div>
        <div className="h-48 bg-silverLite flex flex-col items-center justify-center gap-3 text-ash font-Poppins">
          <MdLocationOff className="text-3xl text-liteBlue" />
          <p className="text-sm font-medium">Map location not available</p>
          <p className="text-xs text-center px-8">
            The broker has not pinned an exact location for this property.
          </p>
        </div>
      </div>
    );
  }

  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-silver">
      {/* Address bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-silver">
        <div className="flex items-center gap-2 text-ash text-sm font-Poppins min-w-0">
          <HiOutlineLocationMarker className="text-blue text-lg flex-shrink-0" />
          <span className="truncate">{address}</span>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 flex-shrink-0 bg-blue text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-liteBlue transition-colors"
        >
          Open in Maps ↗
        </a>
      </div>

      {/* Leaflet map */}
      <div style={{ height: "300px", width: "100%" }}>
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap lat={lat} lng={lng} />
          <CustomZoomControl />
          <Marker position={[lat, lng]}>
            <Popup className="font-Poppins text-sm">{address}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
