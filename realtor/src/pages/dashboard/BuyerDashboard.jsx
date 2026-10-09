import React from "react";
import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import PropertyGrid from "../../components/property/PropertyGrid";
import Footer from "../../components/Layout/Footer";
import { useGetPropertiesQuery } from "../../redux/services/api";
import useFavorites from "../../utils/useFavorites";

const BuyerDashboard = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const { favorites } = useFavorites();
  const { data } = useGetPropertiesQuery();
  const featured = data?.properties?.filter((p) => p.isFeatured)?.slice(0, 4) || [];

  if (!isAuthenticated) return <Redirect to="/login" />;

  const stats = [
    { label: "Saved Properties", value: favorites.length, to: "/dashboard/favorites" },
    { label: "Enquiries Sent", value: "0", to: null },
    { label: "Properties Viewed", value: "0", to: null },
    { label: "Active Alerts", value: "0", to: null },
  ];

  return (
    <div className="bg-silver min-h-screen pt-20">
      <div className="px-4 md:px-10 lg:px-20 py-8">
        {/* Welcome */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 font-Poppins">
          <h1 className="font-bold text-xl text-black mb-1">
            Welcome back, <span className="text-blue">{user?.name || user?.email?.split("@")[0] || "User"}</span>
          </h1>
          <p className="text-ash text-sm">
            Here's what's happening with your property search.
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Search Properties", to: "/search", color: "bg-blue" },
            { label: "Browse Categories", to: "/categories", color: "bg-liteBlue" },
            { label: "Saved Properties", to: "/dashboard/favorites", color: "bg-blue" },
            { label: "List a Property", to: "/dashboard/broker/add-property", color: "bg-black" },
          ].map((action) => (
            <Link key={action.label} to={action.to}>
              <div
                className={`${action.color} text-white rounded-xl p-4 text-center font-Poppins font-semibold text-sm hover:opacity-90 transition-opacity`}
              >
                {action.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const card = (
              <div className="bg-white rounded-xl shadow-md p-5 font-Poppins text-center hover:shadow-lg transition-shadow">
                <p className="text-2xl font-bold text-blue">{stat.value}</p>
                <p className="text-ash text-xs mt-1">{stat.label}</p>
              </div>
            );
            return stat.to ? (
              <Link key={stat.label} to={stat.to}>
                {card}
              </Link>
            ) : (
              <div key={stat.label}>{card}</div>
            );
          })}
        </div>

        {/* Recommended */}
        <div>
          <h2 className="font-Poppins font-bold text-black text-lg mb-4">
            Recommended for You
          </h2>
          <PropertyGrid properties={featured} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BuyerDashboard;
