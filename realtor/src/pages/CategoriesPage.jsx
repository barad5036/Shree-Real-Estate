import React from "react";
import { HiOutlineHome } from "react-icons/hi";
import { MdApartment, MdStorefront, MdBusiness } from "react-icons/md";
import { GiField } from "react-icons/gi";
import { FaCamera } from "react-icons/fa";
import CategoryCard from "../components/property/CategoryCard";
import Footer from "../components/Layout/Footer";
import { PROPERTY_TYPES } from "../data/mockProperties";
import { useGetPropertiesQuery } from "../redux/services/api";

const CategoriesPage = () => {
  const { data } = useGetPropertiesQuery();
  const properties = data?.properties || [];
  
  const countByType = (type) =>
    properties.filter((p) => p.propertyType === type).length;
  const CATEGORIES = [
    {
      label: PROPERTY_TYPES.HOUSE,
      icon: <HiOutlineHome />,
      color: "bg-blue",
    },
    {
      label: PROPERTY_TYPES.APARTMENT,
      icon: <MdApartment />,
      color: "bg-liteBlue",
    },
    {
      label: PROPERTY_TYPES.LAND,
      icon: <GiField />,
      color: "bg-blue",
    },
    {
      label: PROPERTY_TYPES.SHOP,
      icon: <MdStorefront />,
      color: "bg-liteBlue",
    },
    {
      label: PROPERTY_TYPES.WAREHOUSE,
      icon: <MdBusiness />,
      color: "bg-blue",
    },
    {
      label: PROPERTY_TYPES.SHOOTING_LOCATION,
      icon: <FaCamera />,
      color: "bg-black",
    },
  ];

  return (
    <div className="bg-silver min-h-screen pt-20">
      <div className="px-4 md:px-10 lg:px-20 py-12">
        <div className="text-center mb-10">
          <h1 className="font-Poppins font-bold text-3xl text-black mb-3">
            Browse by <span className="text-blue">Category</span>
          </h1>
          <p className="text-ash font-Poppins text-sm max-w-xl mx-auto">
            Explore properties across all categories — from homes and apartments
            to commercial spaces and exclusive shooting locations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.label}
              icon={cat.icon}
              label={cat.label}
              count={countByType(cat.label)}
              color={cat.color}
            />
          ))}
        </div>

        {/* Shooting Locations spotlight */}
        <div className="bg-black rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <FaCamera className="text-white text-2xl" />
              <h2 className="font-Poppins font-bold text-white text-xl">
                Shooting Locations
              </h2>
            </div>
            <p className="text-ash text-sm max-w-md font-Poppins">
              Find unique properties for film shoots, ad campaigns, music
              videos, and photography. Book by the day with full amenity
              details.
            </p>
          </div>
          <a
            href={`/search?propertyType=${encodeURIComponent(PROPERTY_TYPES.SHOOTING_LOCATION)}`}
            className="bg-white text-black font-bold text-sm px-8 py-3 rounded-xl hover:bg-silver transition-colors flex-shrink-0"
          >
            Explore Locations →
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
