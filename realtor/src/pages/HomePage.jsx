import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { BsFillPlayFill } from "react-icons/bs";
import { HiOutlineHome } from "react-icons/hi";
import { MdApartment, MdStorefront, MdBusiness } from "react-icons/md";
import { FaCamera } from "react-icons/fa";
import { GiField } from "react-icons/gi";

import HeroImage from "../assets/HeroImage.svg";
import SearchBar from "../components/search/SearchBar";
import PropertyGrid from "../components/property/PropertyGrid";
import CategoryCard from "../components/property/CategoryCard";
import Purpose from "../components/Layout/Purpose";
import OurService from "../components/Layout/OurService";
import Testimonial from "../components/Layout/Testimonial";
import FAQs from "../components/Layout/FAQs";
import Footer from "../components/Layout/Footer";
import { PROPERTY_TYPES } from "../data/mockProperties";
import { useGetPropertiesQuery } from "../redux/services/api";

const CATEGORIES = [
  { label: PROPERTY_TYPES.HOUSE, icon: <HiOutlineHome />, color: "bg-blue" },
  { label: PROPERTY_TYPES.APARTMENT, icon: <MdApartment />, color: "bg-liteBlue" },
  { label: PROPERTY_TYPES.LAND, icon: <GiField />, color: "bg-blue" },
  { label: PROPERTY_TYPES.SHOP, icon: <MdStorefront />, color: "bg-liteBlue" },
  { label: PROPERTY_TYPES.WAREHOUSE, icon: <MdBusiness />, color: "bg-blue" },
  { label: PROPERTY_TYPES.SHOOTING_LOCATION, icon: <FaCamera />, color: "bg-black" },
];

const HomePage = () => {
  const { data } = useGetPropertiesQuery();
  const properties = data?.properties || [];
  const featured = properties.slice(0, 6);

  return (
    <Fragment>
      {/* Hero */}
      <section className="mt-16 w-full bg-silver h-auto pb-10 lg:pt-6">
        <div className="lg:flex lg:justify-between px-10">
          <div className="lg:px-16 pt-20 lg:pr-0 lg:w-1/2">
            <h2 className="font-Poppins text-3xl font-semibold mb-4">Time to Meet Your</h2>
            <h1 className="text-5xl mb-4 text-blue font-semibold tracking-widest font-Poppins">New Home</h1>
            <p className="font-Poppins text-ash mb-6">
              Buy, rent, or list properties across India. Find houses, apartments,
              commercial spaces, and exclusive shooting locations.
            </p>
            <div className="flex items-center mb-10">
              <Link to="/search">
                <button className="bg-blue text-white font-bold text-xs p-3 px-7 rounded-lg mr-6 shadow-lg">
                  Explore Properties
                </button>
              </Link>
              <button className="bg-blue text-white font-bold text-xs p-3 rounded-full shadow-lg">
                <BsFillPlayFill className="text-lg" />
              </button>
            </div>
          </div>
          <div className="w-full lg:w-9/12 xl:w-full lg:px-16 lg:pl-0 lg:pt-20">
            <img src={HeroImage} alt="Hero" className="w-auto h-auto" />
          </div>
        </div>

        {/* Search bar */}
        <div className="mx-auto w-11/12 md:w-9/12 lg:w-7/12 mt-10 rounded-lg bg-silverLite shadow-md p-6 px-4">
          <h1 className="mb-3 pl-1 text-blue font-Poppins font-medium tracking-wider text-base md:text-lg">
            Search for available properties
          </h1>
          <SearchBar />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto bg-silverLite px-10 md:px-16 lg:px-20 py-16">
        <div className="text-center mb-8">
          <h1 className="font-Poppins font-bold text-3xl mb-3">
            Browse by <span className="text-blue">Category</span>
          </h1>
          <p className="text-ash text-sm">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.label}
              icon={cat.icon}
              label={cat.label}
              count={properties.filter((p) => p.propertyType === cat.label).length}
              color={cat.color}
            />
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <Link to="/categories">
            <button className="font-Poppins bg-silverLite border-2 border-blue text-blue font-medium text-base px-8 py-2 rounded-md shadow-lg hover:bg-blue hover:text-white transition-colors">
              View All Categories
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="mx-auto bg-silver px-10 md:px-16 lg:px-20 py-16">
        <div className="text-center mb-8">
          <h1 className="font-Poppins font-bold text-3xl mb-3">
            Featured <span className="text-blue">Properties</span>
          </h1>
          <p className="text-ash text-sm">Hand-picked listings for you</p>
        </div>
        <PropertyGrid properties={featured} />
        <div className="flex justify-center mt-8">
          <Link to="/search">
            <button className="font-Poppins bg-silverLite border-2 border-blue text-blue font-medium text-base px-8 py-2 rounded-md shadow-lg hover:bg-blue hover:text-white transition-colors">
              Explore All Properties
            </button>
          </Link>
        </div>
      </section>

      {/* Shooting Locations CTA */}
      <section className="mx-auto bg-black px-10 md:px-16 lg:px-20 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <FaCamera className="text-white text-3xl" />
              <h2 className="font-Poppins font-bold text-white text-2xl">Shooting Locations</h2>
            </div>
            <p className="text-ash font-Poppins text-sm max-w-lg">
              Discover unique properties for film shoots, ad campaigns, music videos, and
              photography. Book by the day with full amenity details.
            </p>
          </div>
          <Link to={`/search?propertyType=${encodeURIComponent(PROPERTY_TYPES.SHOOTING_LOCATION)}`}>
            <button className="bg-white text-black font-bold text-sm px-8 py-3 rounded-xl hover:bg-silver transition-colors flex-shrink-0">
              Find Shooting Locations →
            </button>
          </Link>
        </div>
      </section>

      <Purpose />
      <OurService />
      <Testimonial />
      <FAQs />
      <Footer />
    </Fragment>
  );
};

export default HomePage;
