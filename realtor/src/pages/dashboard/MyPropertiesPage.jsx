import React from "react";
import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { MdEdit, MdDelete, MdVisibility, MdAdd } from "react-icons/md";
import Footer from "../../components/Layout/Footer";
import Loader from "../../components/UI/Loader";
import { useGetMyPropertiesQuery, useDeleteMyPropertyMutation } from "../../redux/services/api";

const MyPropertiesPage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const { data, isLoading, error } = useGetMyPropertiesQuery();
  const [deleteMyProperty] = useDeleteMyPropertyMutation();
  const properties = data?.properties || [];

  if (!isAuthenticated || (user?.role !== "broker" && user?.role !== "admin")) {
    return <Redirect to="/login" />;
  }

  if (isLoading) return <Loader />;
  if (error) return (
    <div className="min-h-screen bg-silver pt-32 flex items-center justify-center font-Poppins text-ash">
      Failed to load properties.
    </div>
  );

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      await deleteMyProperty(id);
    }
  };

  const statusStyle = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-silver min-h-screen pt-20">
      <div className="px-4 md:px-10 lg:px-20 py-8 max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 font-Poppins flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-bold text-xl text-black mb-1">My Properties</h1>
            <p className="text-ash text-sm">{properties.length} listing{properties.length !== 1 ? "s" : ""} found</p>
          </div>
          <Link to="/dashboard/broker/add-property">
            <button className="flex items-center gap-2 bg-blue text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-liteBlue transition-colors">
              <MdAdd className="text-lg" /> Add New Property
            </button>
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-16 flex flex-col items-center gap-4 font-Poppins text-center">
            <p className="text-ash text-base">You haven't added any properties yet.</p>
            <Link to="/dashboard/broker/add-property">
              <button className="bg-blue text-white font-bold text-sm px-8 py-3 rounded-xl hover:bg-liteBlue transition-colors">
                Add Your First Property
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property._id} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow">

                {/* Image */}
                <div className="relative">
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-silver flex items-center justify-center text-ash text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1 font-Poppins">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-ash uppercase font-medium">{property.propertyType}</p>
                    <span style={{
                      backgroundColor: property.status === "approved" ? "#dcfce7" : property.status === "pending" ? "#fee2e2" : "#fecaca",
                      color: property.status === "approved" ? "#16a34a" : "#dc2626"
                    }} className="text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {property.status === "approved" ? "● Approved" : property.status === "pending" ? "● Pending" : "● Rejected"}
                    </span>
                  </div>
                  <h3 className="font-bold text-black text-sm mb-1 line-clamp-2">{property.title}</h3>
                  <p className="text-ash text-xs mb-2 truncate">{property.address}</p>
                  <p className="text-blue font-bold text-base mb-1">₹{property.price?.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-ash mb-4">
                    {property.bedrooms > 0 && `${property.bedrooms} Bed · `}
                    {property.bathrooms > 0 && `${property.bathrooms} Bath · `}
                    {property.area} sqft
                  </p>

                  {/* Action buttons */}
                  <div className="mt-auto flex gap-2">
                    <Link to={`/property/${property._id}`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-1 border border-silver text-ash text-xs font-semibold py-2 rounded-lg hover:border-blue hover:text-blue transition-colors">
                        <MdVisibility className="text-base" /> View
                      </button>
                    </Link>
                    <Link to={`/dashboard/broker/edit-property/${property._id}`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-1 bg-blue text-white text-xs font-semibold py-2 rounded-lg hover:bg-liteBlue transition-colors">
                        <MdEdit className="text-base" /> Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(property._id, property.title)}
                      className="flex items-center justify-center gap-1 border border-red-200 text-red-400 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <MdDelete className="text-base" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyPropertiesPage;
