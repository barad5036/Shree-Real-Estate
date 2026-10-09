import React from "react";
//import HeroImage from "../../assets/Heroimg.png";
import { BsFillPlayFill } from "react-icons/bs";
import HeroImage from "../../assets/HeroImage.svg";
import HeroForm from "../Forms/HeroForm";

const Hero = () => {
  return (
    <section className="mt-16 w-full bg-silver h-auto pb-10 lg:pt-6">
      <div className="flex flex-col lg:flex-row lg:justify-between px-6 md:px-10 lg:px-10">
        <div className="lg:px-16 pt-12 lg:pt-20 lg:pr-0 lg:w-1/2 text-center lg:text-left">
          <h2 className="font-Poppins text-2xl md:text-3xl font-semibold mb-3">
            Time to Meet Your
          </h2>
          <h1 className="text-4xl md:text-5xl mb-4 text-blue font-semibold tracking-widest font-Poppins">
            New Home
          </h1>
          <p className="font-Poppins text-ash mb-6 text-sm md:text-base">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
            blanditiis amet laborum cumque sequi consequatur?
          </p>
          <div className="flex items-center justify-center lg:justify-start mb-8">
            <button className="bg-blue text-white font-bold text-xs p-3 px-7 rounded-lg mr-6 shadow-lg">
              Learn More
            </button>
            <button className="bg-blue text-white font-bold text-xs p-3 rounded-full shadow-lg">
              <BsFillPlayFill className="text-lg" />
            </button>
          </div>
        </div>
        <div className="w-full lg:w-9/12 xl:w-full lg:px-16 lg:pl-0 lg:pt-20">
          <img src={HeroImage} alt="Hero" className="w-full h-auto" />
        </div>
      </div>
      <HeroForm />
    </section>
  );
};

export default Hero;
