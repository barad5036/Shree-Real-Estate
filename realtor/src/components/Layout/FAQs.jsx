import React, { useState } from "react";
import FAQsItem from "../Data/FAQsItem";

const faqsData = [
  {
    id: "q1",
    que: "How do I search for properties on Shree Real Estate?",
    ans: "Use the search bar on the homepage — select whether you want to Buy or Rent, enter a city name, and hit Search. You can further narrow results using the filter sidebar on the Search page to filter by property type, price range, number of bedrooms, and area size.",
  },
  {
    id: "q2",
    que: "What is the difference between 'For Sale' and 'For Rent' listings?",
    ans: "'For Sale' listings are properties available for outright purchase where you become the owner. 'For Rent' listings are properties available on a monthly or annual lease basis. You can toggle between both using the Buy/Rent selector in the search bar or the listing type filter in the sidebar.",
  },
  {
    id: "q3",
    que: "What are Shooting Locations and how do they work?",
    ans: "Shooting Locations are properties listed specifically for film, TV, commercial, and photography shoots. Each shooting location shows a daily rental price, whether it is indoor or outdoor, and parking availability. You can browse all shooting locations under the Categories page or filter by 'Shooting Location' in the property type filter.",
  },
  {
    id: "q4",
    que: "How do I save a property and view it later?",
    ans: "Click the heart icon on any property card or detail page to save it to your favourites. Your saved properties are stored locally and can be accessed anytime from My Dashboard → Saved Properties. You do not need to be logged in to save properties.",
  },
  {
    id: "q5",
    que: "How do I contact a broker about a property?",
    ans: "Open any property detail page and use the 'Contact Broker' form on the right side. Fill in your name, phone number, and message and submit. The broker will reach out to you directly. You need to be logged in to send an enquiry.",
  },
  {
    id: "q6",
    que: "How do I list my property on Shree Real Estate?",
    ans: "Create an account and go to Broker Dashboard → Add Property. Fill in the property details including title, type, price, location, description, and upload photos. Once submitted, your listing will be reviewed by our admin team and published within 24 hours after approval.",
  },
  {
    id: "q7",
    que: "Are the property prices negotiable?",
    ans: "Prices listed on the platform are set by the property owner or broker and serve as the asking price. All negotiations happen directly between the buyer or tenant and the broker. Use the Contact Broker form to initiate a conversation and discuss pricing.",
  },
  {
    id: "q8",
    que: "Is my personal information safe on this platform?",
    ans: "Yes. We use industry-standard JWT-based authentication and never share your personal details with third parties without your consent. Your contact information is only shared with the broker when you submit an enquiry for a specific property.",
  },
];

const FAQs = () => {
  const [openId, setOpenId] = useState("q1");

  const handleToggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="mx-auto bg-silver px-6 md:px-16 lg:px-20 py-20">
      <h1 className="font-Poppins font-bold text-3xl text-center mb-3">
        Frequently Asked <span className="text-blue">Questions</span>
      </h1>
      <p className="font-Poppins text-ash text-center text-sm mb-12">
        Everything you need to know about buying, renting, and listing properties.
      </p>
      <div className="lg:mx-20 xl:mx-36 bg-white rounded-2xl shadow-md px-6 md:px-10 py-2">
        {faqsData.map((item) => (
          <FAQsItem
            key={item.id}
            id={item.id}
            que={item.que}
            ans={item.ans}
            isOpen={openId === item.id}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </section>
  );
};

export default FAQs;
