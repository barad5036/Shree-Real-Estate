import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useFavorites from "../../utils/useFavorites";

const FavoriteButton = ({ propertyId, className = "" }) => {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(propertyId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(propertyId);
      }}
      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
        fav ? "text-red-500" : "text-ash hover:text-red-400"
      } ${className}`}
    >
      {fav ? <FaHeart /> : <FaRegHeart />}
      {fav ? "Saved" : "Save"}
    </button>
  );
};

export default FavoriteButton;
