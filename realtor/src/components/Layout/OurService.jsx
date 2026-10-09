import React, { Fragment } from "react";
import OurServiceImage from "../../assets/OurService.png";
import { MdOutlineEast } from "react-icons/md";
import { MdOutlineRemoveCircle } from "react-icons/md";

const OurService = () => {
  return (
    <Fragment>
      <section className="mx-auto bg-silverLite px-10 md:px-16 lg:px-20 py-20 pt-20 md:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-1/2 lg:px-10 lg:mr-6">
            <img className="w-full h-auto max-h-80 lg:max-h-none object-contain" src={OurServiceImage} alt="Scraper" />
          </div>
          <div className="mt-10 lg:mt-0 lg:mx-10">
            <h3 className="flex items-center font-Poppins text-ash text-sm tracking-widest uppercase">
              <MdOutlineEast className="text-blue mr-3" />
              Our Services
            </h3>

            <h1 className="font-Poppins text-blue font-bold text-2xl py-2">
              Your Comfort Is Our Priority
            </h1>
            <p className="font-Poppins text-ash mb-6 leading-relaxed">
              At Shree Real Estate, we go beyond just listing properties. We provide end-to-end support — from your first search to the final handover — ensuring a smooth, transparent, and stress-free experience for every buyer, seller, and investor.
            </p>
            <div className="flex mt-2">
              <div className="pr-8">
                <h2 className="flex items-center text-ash mb-3 text-sm">
                  <MdOutlineRemoveCircle className="text-blue mr-2 flex-shrink-0" />
                  Verified Listings
                </h2>
                <h2 className="flex items-center text-ash text-sm">
                  <MdOutlineRemoveCircle className="text-blue mr-2 flex-shrink-0" />
                  Expert Guidance
                </h2>
              </div>
              <div>
                <h2 className="flex items-center text-ash mb-3 text-sm">
                  <MdOutlineRemoveCircle className="text-blue mr-2 flex-shrink-0" />
                  Free Property Listing
                </h2>
                <h2 className="flex items-center text-ash text-sm">
                  <MdOutlineRemoveCircle className="text-blue mr-2 flex-shrink-0" />
                  Direct Broker Connect
                </h2>
              </div>
            </div>
            <div className="pt-6">
              <button className="bg-blue text-white font-bold text-sm px-8 py-3 rounded-lg shadow-lg hover:bg-liteBlue transition-colors">
                Explore Services
              </button>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default OurService;
