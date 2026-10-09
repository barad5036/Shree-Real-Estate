import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PropertiesItem from "../Data/PropertiesItem";

import { useGetPropertiesQuery } from "../../redux/services/api";
import Loader from "../UI/Loader";
import Error from "../UI/Error";

const Properties = () => {
  const { data, isFetching, error } = useGetPropertiesQuery({ limit: 4 });

  const propertiesData = data?.properties?.slice(0, 4) || [];

  const mappedList = propertiesData?.map((property) => {
    return (
      <PropertiesItem
        key={property._id}
        id={property._id}
        numOfBed={property.bedrooms}
        numOfBath={property.bathrooms}
        size={property.area}
        price={property.price}
        address={property.address}
        image={property.images?.[0] || '/api/placeholder/400/300'}
        state={property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
        rentType={property.listingType === 'rent' ? 'month' : ''}
      />
    );
  });

  return (
    <Fragment>
      <section className="mx-auto bg-silver px-10 md:px-16 lg:px-20 py-20 pt-20 md:py-16">
        <div className="px-auto lg:px-32 mb-6">
          <h1 className="font-Poppins font-bold text-3xl text-center mb-4">
            Our Most Popular <span className="text-blue">Trending</span>
          </h1>
          <p className="text-center text-ash">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore
            facilis libero, esse recusandae nam veniam aut accusamus.
          </p>
        </div>
        <ul className="flex flex-wrap justify-center lg:justify-between">
          {isFetching && <Loader />}
          {!isFetching && !error && mappedList && mappedList.length > 0 && mappedList}
          {!isFetching && !error && (!mappedList || mappedList.length === 0) && <Error />}
          {error && <Error />}
        </ul>
        <div className="flex items-center  justify-center px-4 pb-3 pt-5">
          <Link to="/listings">
            <button className="font-Poppins bg-silverLite border-2 border-blue text-blue font-medium text-base px-8 py-2 rounded-md shadow-lg hover:bg-blue hover:text-white">
              Explore All
            </button>
          </Link>
        </div>
      </section>
    </Fragment>
  );
};

export default Properties;
