import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ icon, label, count, color = "bg-blue" }) => {
  return (
    <Link to={`/search?propertyType=${encodeURIComponent(label)}`}>
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
        <div
          className={`${color} text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <p className="font-Poppins font-semibold text-black text-sm text-center">
          {label}
        </p>
        {count !== undefined && (
          <p className="text-ash text-xs">{count} listings</p>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
