import React, { Fragment, useState } from "react";
import { ImQuotesRight } from "react-icons/im";

const TestimonialItems = ({ data }) => {
  const [current, setCurrent] = useState(data[0]);
  const [active, setActive] = useState(current);

  const handleClick = (e) => {
    setCurrent(data[e.target.getAttribute("data-testimonial")]);
    setActive(e.target.getAttribute("data-testimonial"));
  };

  return (
    <Fragment>
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <div className="w-full md:w-auto flex-shrink-0">
            <img
              className="w-full md:w-72 lg:w-80 h-64 md:h-72 object-cover rounded-2xl"
              src={current.image}
              alt="real estate"
            />
          </div>
          <div className="flex-1 max-w-xl">
            <h1 className="font-Poppins text-base md:text-xl text-ash text-center mt-4 md:mt-0">
              {current.text}
            </h1>
            <div className="flex justify-center">
              <div className="mb-6 md:mb-5">
                <h2 className="font-Poppins text-blue text-lg text-center mt-6 font-semibold">
                  {current.name}
                </h2>
                <p className="font-Poppins text-ash text-center text-sm">{current.role}</p>
              </div>
              <div>
                <ImQuotesRight className="absolute ml-8 md:ml-16 text-silver text-5xl" />
              </div>
            </div>
            <div className="flex items-center justify-center">
              {Object.keys(data).map((index) => (
                <span
                  id={index}
                  key={index}
                  data-testimonial={index}
                  onClick={handleClick}
                  className={`py-1 w-8 md:w-10 rounded mx-1 cursor-pointer ${
                    active === index ? "bg-blue" : "bg-[#d4d4d4]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TestimonialItems;
