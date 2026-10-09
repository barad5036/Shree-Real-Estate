import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import PropertyGrid from "../../components/property/PropertyGrid";
import Footer from "../../components/Layout/Footer";
import Loader from "../../components/UI/Loader";
import Error from "../../components/UI/Error";
import { useGetPropertiesQuery } from "../../redux/services/api";
import useFavorites from "../../utils/useFavorites";

const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const { data, isLoading, error } = useGetPropertiesQuery();
  const properties = data?.properties || [];
  const savedProperties = properties.filter((p) =>
    favorites.includes(p._id)
  );

  if (isLoading) return <Loader />;
  if (error) return <Error />;

  return (
    <div className="bg-silver min-h-screen pt-20">
      <div className="px-4 md:px-10 lg:px-20 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <FaHeart className="text-red-500 text-xl" />
          <h1 className="font-Poppins font-bold text-2xl text-black">
            Saved Properties
          </h1>
        </div>
        <p className="text-ash text-sm font-Poppins mb-8">
          {savedProperties.length > 0
            ? `You have ${savedProperties.length} saved ${
                savedProperties.length === 1 ? "property" : "properties"
              }.`
            : "You haven't saved any properties yet."}
        </p>

        {savedProperties.length > 0 ? (
          <PropertyGrid properties={savedProperties} />
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-16 flex flex-col items-center gap-4 font-Poppins">
            <FaHeart className="text-silver text-6xl" />
            <p className="text-ash text-base">No saved properties yet.</p>
            <p className="text-ash text-sm text-center max-w-sm">
              Browse properties and click the heart icon to save them here for
              quick access.
            </p>
            <Link to="/search">
              <button className="bg-blue text-white font-bold text-sm px-8 py-3 rounded-xl hover:bg-liteBlue transition-colors mt-2">
                Browse Properties
              </button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default FavoritesPage;
