import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiHotelBedFill } from "react-icons/ri";
import { FaBath, FaHeart, FaRegHeart, FaCamera } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { PROPERTY_TYPES } from "../../data/mockProperties";

const formatPrice = (property) => {
  if (property.propertyType === PROPERTY_TYPES.SHOOTING_LOCATION)
    return `₹${property.dailyPrice?.toLocaleString("en-IN")}/day`;
  if (property.listingType === "rent")
    return `₹${property.price?.toLocaleString("en-IN")}/mo`;
  return `₹${property.price?.toLocaleString("en-IN")}`;
};

const PropertyCard = ({ property, isFavorite, onToggleFavorite }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isShoot = property.propertyType === PROPERTY_TYPES.SHOOTING_LOCATION;

  return (
    <div
      className="group bg-white rounded-3xl overflow-hidden flex flex-col"
      style={{
        boxShadow: "0 4px 24px rgba(58,118,218,0.08)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 16px 48px rgba(58,118,218,0.18)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(58,118,218,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* ── Image Section ── */}
      <div className="relative overflow-hidden" style={{ height: "220px" }}>
        {/* Skeleton */}
        {!imgLoaded && (
          <div
            className="absolute inset-0 bg-silver"
            style={{
              background: "linear-gradient(90deg, #f0f3f7 25%, #e8ecf2 50%, #f0f3f7 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }}
          />
        )}

        <Link to={`/property/${property._id}`}>
          <img
            src={property.images?.[0]}
            alt={property.title}
            onLoad={() => setImgLoaded(true)}
            className="w-full h-full object-cover"
            style={{ transition: "transform 0.5s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Link>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%, transparent 55%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Top-left: listing type tag */}
        <span
          className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1.5 rounded-full"
          style={{
            background: property.listingType === "rent"
              ? "rgba(139,172,226,0.92)"
              : "rgba(58,118,218,0.92)",
            backdropFilter: "blur(8px)",
            letterSpacing: "0.04em",
          }}
        >
          {property.listingType === "rent" ? "For Rent" : "For Sale"}
        </span>

        {/* Shooting location badge */}
        {isShoot && (
          <span
            className="absolute top-3 left-24 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
          >
            <FaCamera className="text-xs" /> Shoot
          </span>
        )}

        {/* Top-right: favorite */}
        <button
          onClick={() => onToggleFavorite && onToggleFavorite(property._id)}
          className="absolute top-3 right-3 flex items-center justify-center rounded-full"
          style={{
            width: 36, height: 36,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            transition: "transform 0.2s ease",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {isFavorite
            ? <FaHeart style={{ color: "#ef4444", fontSize: 14 }} />
            : <FaRegHeart style={{ color: "#3A76DA", fontSize: 14 }} />}
        </button>

        {/* Bottom-left: location */}
        <div
          className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-medium"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
        >
          <HiOutlineLocationMarker className="flex-shrink-0 text-sm" />
          <span className="truncate max-w-[140px]">{property.city}</span>
        </div>

        {/* Bottom-right: price */}
        <div
          className="absolute bottom-3 right-3 text-white font-bold text-sm"
          style={{
            textShadow: "0 1px 6px rgba(0,0,0,0.6)",
            letterSpacing: "-0.01em",
          }}
        >
          {formatPrice(property)}
        </div>
      </div>

      {/* ── Content Section ── */}
      <div className="p-4 flex flex-col flex-1">
        {/* Type label */}
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#8bace2" }}>
          {property.propertyType}
        </p>

        {/* Title */}
        <Link to={`/property/${property._id}`}>
          <h3
            className="font-Poppins font-bold text-black text-sm mb-1 line-clamp-1"
            style={{ transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#3A76DA")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#000")}
          >
            {property.title}
          </h3>
        </Link>

        {/* Address */}
        <p className="text-xs mb-3 truncate" style={{ color: "#666565" }}>
          {property.address}
        </p>

        {/* Stats row */}
        {(property.bedrooms > 0 || property.bathrooms > 0 || property.area > 0) && (
          <div
            className="flex items-center gap-3 text-xs mb-4 pb-4"
            style={{ borderBottom: "1px solid #f0f3f7", color: "#666565" }}
          >
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <RiHotelBedFill style={{ color: "#3A76DA" }} />
                {property.bedrooms} Bed
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <FaBath style={{ color: "#3A76DA" }} />
                {property.bathrooms} Bath
              </span>
            )}
            <span className="flex items-center gap-1">
              <MdSpaceDashboard style={{ color: "#3A76DA" }} />
              {property.area} sqft
            </span>
          </div>
        )}

        {/* Shooting extras */}
        {isShoot && (
          <div className="flex gap-2 flex-wrap mb-3">
            {property.indoorOutdoor && (
              <span className="bg-silver text-ash text-xs px-2 py-0.5 rounded-full">{property.indoorOutdoor}</span>
            )}
            {property.parkingAvailable && (
              <span className="bg-silver text-ash text-xs px-2 py-0.5 rounded-full">Parking ✓</span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto">
          <Link to={`/property/${property._id}`}>
            <button
              className="w-full text-sm font-bold py-2.5 rounded-2xl font-Poppins"
              style={{
                background: "linear-gradient(135deg, #3A76DA 0%, #8bace2 100%)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                transition: "opacity 0.2s ease, transform 0.2s ease",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.88";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              View Details →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
