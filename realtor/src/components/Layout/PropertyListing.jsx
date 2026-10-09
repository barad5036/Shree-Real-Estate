import React, { Fragment } from "react";
import PropertiesItem from "../Data/PropertiesItem";

import { useGetPropertiesQuery } from "../../redux/services/api";
import Loader from "../UI/Loader";
import Error from "../UI/Error";

const Properties = () => {
  const { data, isFetching, error } = useGetPropertiesQuery();

  const propertiesData = data?.properties || [];

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
        <div className="px-auto lg:px-32">
          <h1 className="font-Poppins font-bold text-4xl text-center tracking-wider mb-4">
            List of <span className="text-blue">Properties</span>
          </h1>
        </div>
        <div>
          <ul className="flex justify-center flex-col lg:flex-row lg:flex-wrap ">
            {isFetching && <Loader />}
            {!isFetching && !error && mappedList}
            {!isFetching && mappedList?.length === 0 && <Error />}
          </ul>
        </div>
      </section>
    </Fragment>
  );
};

export default Properties;
