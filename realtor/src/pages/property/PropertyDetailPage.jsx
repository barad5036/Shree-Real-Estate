import React, { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { RiHotelBedFill } from "react-icons/ri";
import { FaBath, FaCamera } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";

import PropertyGallery from "../../components/property/PropertyGallery";
import FavoriteButton from "../../components/property/FavoriteButton";
import ContactBrokerForm from "../../components/Forms/ContactBrokerForm";
import MapView from "../../components/property/MapView";
import Footer from "../../components/Layout/Footer";
import Loader from "../../components/UI/Loader";
import Error from "../../components/UI/Error";
import { useGetPropertyByIdQuery } from "../../redux/services/api";
import { PROPERTY_TYPES } from "../../data/mockProperties";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const topRef = useRef();
  const { data, isLoading, error } = useGetPropertyByIdQuery(id);
  const property = data?.property;

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-silver pt-32 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-silver pt-32 flex flex-col items-center justify-center font-Poppins">
        <Error />
        <p className="text-2xl font-bold text-blue mb-4">Property Not Found</p>
        <Link to="/search" className="text-ash hover:text-blue underline text-sm">
          Back to Search
        </Link>
      </div>
    );
  }

  const isShootingLocation =
    property.propertyType === PROPERTY_TYPES.SHOOTING_LOCATION;

  const displayPrice = isShootingLocation
    ? `₹${property.dailyPrice?.toLocaleString("en-IN")}/day`
    : property.listingType === "rent"
    ? `₹${property.price?.toLocaleString("en-IN")}/month`
    : `₹${property.price?.toLocaleString("en-IN")}`;

  return (
    <div className="bg-silver min-h-screen pt-20" ref={topRef}>
      <div className="px-4 md:px-10 lg:px-20 py-8 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-xs text-ash font-Poppins mb-4 flex gap-2">
          <Link to="/home" className="hover:text-blue">Home</Link>
          <span>/</span>
          <Link to="/search" className="hover:text-blue">Search</Link>
          <span>/</span>
          <span className="text-black">{property.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column */}
          <div className="flex-1">
            <PropertyGallery images={property.images} title={property.title} />

            <div className="bg-white rounded-2xl shadow-md p-6 mt-6 font-Poppins">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-white text-xs font-medium px-3 py-1 rounded-full ${property.listingType === "rent" ? "bg-liteBlue" : "bg-blue"}`}>
                      {property.listingType === "rent" ? "For Rent" : "For Sale"}
                    </span>
                    <span className="text-xs text-ash border border-silver px-3 py-1 rounded-full">
                      {property.propertyType}
                    </span>
                    {isShootingLocation && (
                      <span className="text-xs bg-black text-white px-3 py-1 rounded-full flex items-center gap-1">
                        <FaCamera className="text-xs" /> Shooting Location
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold text-black mt-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-ash text-sm mt-1">
                    <HiOutlineLocationMarker className="mr-1" />
                    {property.address}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue">{displayPrice}</p>
                  <FavoriteButton propertyId={property._id} className="mt-1 justify-end" />
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 py-4 border-t border-b border-silver my-4">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-2 text-ash text-sm">
                    <RiHotelBedFill className="text-blue text-lg" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex items-center gap-2 text-ash text-sm">
                    <FaBath className="text-blue text-lg" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-ash text-sm">
                  <MdSpaceDashboard className="text-blue text-lg" />
                  <span>{property.area} sqft</span>
                </div>
              </div>

              {/* Shooting location extras */}
              {isShootingLocation && (
                <div className="bg-silver rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-blue uppercase mb-3 flex items-center gap-2">
                    <FaCamera /> Shooting Location Details
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-ash">
                    <div>
                      <p className="text-xs text-ash uppercase font-semibold mb-0.5">Daily Rate</p>
                      <p className="font-bold text-black">₹{property.dailyPrice?.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ash uppercase font-semibold mb-0.5">Setting</p>
                      <p className="font-bold text-black">{property.indoorOutdoor}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ash uppercase font-semibold mb-0.5">Parking</p>
                      <p className="font-bold text-black">{property.parkingAvailable ? "Available ✓" : "Not Available"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h2 className="font-bold text-black text-base mb-2">About this Property</h2>
                <p className="text-ash text-sm leading-relaxed">{property.description}</p>
              </div>
            </div>

            {/* Map */}
            <div className="mt-6">
              <h2 className="font-Poppins font-bold text-black text-base mb-3">Location</h2>
              <MapView
                latitude={property.latitude}
                longitude={property.longitude}
                address={property.address}
              />
            </div>
          </div>

          {/* Right column — sticky contact form */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <ContactBrokerForm
                propertyId={property._id}
                ownerName={property.owner?.name || 'Property Owner'}
                contactPhone={property.contactPhone}
                propertyTitle={property.title}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetailPage;
