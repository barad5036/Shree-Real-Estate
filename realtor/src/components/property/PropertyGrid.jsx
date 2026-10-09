import React from "react";
import PropertyCard from "./PropertyCard";
import useFavorites from "../../utils/useFavorites";

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(58,118,218,0.08)" }}>
    <div
      className="w-full"
      style={{
        height: 220,
        background: "linear-gradient(90deg, #f0f3f7 25%, #e8ecf2 50%, #f0f3f7 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
    <div className="p-4 space-y-3">
      <div className="h-3 rounded-full w-1/3" style={{ background: "#f0f3f7" }} />
      <div className="h-4 rounded-full w-3/4" style={{ background: "#f0f3f7" }} />
      <div className="h-3 rounded-full w-1/2" style={{ background: "#f0f3f7" }} />
      <div className="flex gap-3 pt-1">
        <div className="h-3 rounded-full w-12" style={{ background: "#f0f3f7" }} />
        <div className="h-3 rounded-full w-12" style={{ background: "#f0f3f7" }} />
        <div className="h-3 rounded-full w-16" style={{ background: "#f0f3f7" }} />
      </div>
      <div className="h-10 rounded-2xl w-full mt-2" style={{ background: "#f0f3f7" }} />
    </div>
  </div>
);

const PropertyGrid = ({ properties, emptyMessage, isLoading }) => {
  const { isFavorite, toggle } = useFavorites();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 font-Poppins">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: "linear-gradient(135deg, #f0f3f7, #e8ecf2)" }}
        >
          <span style={{ fontSize: 44 }}>🏠</span>
        </div>
        <p className="font-bold text-black text-lg mb-2">No properties found</p>
        <p className="text-ash text-sm text-center max-w-xs">
          {emptyMessage || "Try adjusting your filters or search in a different city."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
          isFavorite={isFavorite(property._id)}
          onToggleFavorite={toggle}
        />
      ))}
    </div>
  );
};

export default PropertyGrid;
