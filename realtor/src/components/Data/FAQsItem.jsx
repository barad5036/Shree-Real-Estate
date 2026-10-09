import React from "react";
import { IoIosArrowDown } from "react-icons/io";

const FAQsItem = ({ id, que, ans, isOpen, onToggle }) => (
  <div className="border-b border-[#dde3ed] last:border-none">
    <button
      className="w-full flex justify-between items-center py-5 text-left gap-4 cursor-pointer"
      onClick={() => onToggle(id)}
    >
      <span className={`font-Poppins text-base font-medium transition-colors ${isOpen ? "text-blue" : "text-black"}`}>
        {que}
      </span>
      <IoIosArrowDown
        className={`flex-shrink-0 text-xl transition-transform duration-300 ${isOpen ? "rotate-180 text-blue" : "text-ash"}`}
      />
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-5" : "max-h-0"}`}
    >
      <p className="font-Poppins text-ash text-sm leading-relaxed">{ans}</p>
    </div>
  </div>
);

export default FAQsItem;
