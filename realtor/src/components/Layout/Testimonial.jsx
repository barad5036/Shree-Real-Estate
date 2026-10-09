import React, { Fragment } from "react";

import TestimonialItems from "../Data/TestimonialItems";

import Client1 from "../../assets/Client1.jpg";
import Client2 from "../../assets/Client2.jpg";
import Client3 from "../../assets/Client3.jpg";
import Client4 from "../../assets/Client4.jpg";

const testimonialData = [
  {
    id: "p1",
    text: "Shree Real Estate made finding our dream home incredibly easy. The listings were accurate, the broker was responsive, and we closed the deal within two weeks. Highly recommend to anyone looking to buy in Pune.",
    name: "Priya Sharma",
    role: "Home Buyer, Pune",
    image: Client1,
  },
  {
    id: "p2",
    text: "As a broker, this platform has transformed how I manage my listings. The approval workflow is smooth, enquiries come in directly, and I can track every lead from one dashboard. It's the best tool I've used.",
    name: "Rajesh Mehta",
    role: "Property Broker, Mumbai",
    image: Client2,
  },
  {
    id: "p3",
    text: "I was relocating from Bangalore and needed a rental quickly. Within 24 hours of signing up, I had three verified options in my budget. The contact broker feature saved me so much time and back-and-forth.",
    name: "Ananya Iyer",
    role: "Tenant, Bangalore",
    image: Client3,
  },
  {
    id: "p4",
    text: "We listed our commercial property as a shooting location and got enquiries within days. The platform is well-designed, the team is professional, and the whole process was completely transparent.",
    name: "Vikram Nair",
    role: "Property Owner, Hyderabad",
    image: Client4,
  },
];

const Testimonial = () => {
  const mappedList = <TestimonialItems data={testimonialData} />;
  return (
    <Fragment>
      <section className="mx-auto bg-silverLite px-10 md:px-16 lg:px-20 py-20 pt-20 md:py-16">
        <div className="flex flex-col md:flex-row justify-between px-auto">
          <div>
            <h1 className="font-Poppins font-bold text-3xl text-left mb-3">
              What Our Clients <span className="text-blue">Say</span>
            </h1>
            <p className="text-left text-ash">
              Real stories from buyers, sellers, and brokers who found success with Shree Real Estate.
            </p>
          </div>
        </div>
        <div className="flex justify-center flex-col lg:flex-row my-6">
          {mappedList}
        </div>
      </section>
    </Fragment>
  );
};

export default Testimonial;
