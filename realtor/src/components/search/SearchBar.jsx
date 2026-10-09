import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { BiSearchAlt } from "react-icons/bi";
import { FaChevronDown, FaHome, FaKey } from "react-icons/fa";
import { MdHomeWork } from "react-icons/md";
import { LISTING_TYPES } from "../../data/mockProperties";

const OPTIONS = [
  { value: "", label: "Buy or Rent", icon: <MdHomeWork className="text-base" /> },
  { value: LISTING_TYPES.SALE, label: "Buy", icon: <FaHome className="text-base" /> },
  { value: LISTING_TYPES.RENT, label: "Rent", icon: <FaKey className="text-base" /> },
];

const SearchBar = ({ defaultCity = "", defaultType = "" }) => {
  const [city, setCity] = useState(defaultCity);
  const [listingType, setListingType] = useState(defaultType);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const history = useHistory();

  // Keep local state in sync if parent passes new defaults (e.g. URL change)
  useEffect(() => { setCity(defaultCity); }, [defaultCity]);
  useEffect(() => { setListingType(defaultType); }, [defaultType]);

  const selected = OPTIONS.find((o) => o.value === listingType) || OPTIONS[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (value) => {
    setListingType(value);
    setDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set("city", city.trim());
    if (listingType) params.set("listingType", listingType);
    history.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl shadow-lg border border-silver overflow-visible">

        {/* Custom Dropdown */}
        <div ref={dropdownRef} className="relative sm:border-r border-b sm:border-b-0 border-silver">
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className="h-14 px-4 w-full sm:w-40 flex items-center justify-between gap-2 bg-silverLite hover:bg-silver transition-colors rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none font-Poppins"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-black">
              <span className="text-blue">{selected.icon}</span>
              {selected.label}
            </span>
            <FaChevronDown
              className={`text-ash text-xs transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-silver z-50 overflow-hidden font-Poppins">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors
                    ${listingType === opt.value
                      ? "bg-blue text-white font-semibold"
                      : "text-ash hover:bg-silverLite hover:text-black"
                    }`}
                >
                  <span className={listingType === opt.value ? "text-white" : "text-blue"}>
                    {opt.icon}
                  </span>
                  {opt.label}
                  {listingType === opt.value && (
                    <span className="ml-auto text-white text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city, locality or project..."
          className="flex-1 h-14 px-5 text-sm text-black placeholder-ash outline-none bg-white border-b sm:border-b-0 border-silver font-Poppins"
        />

        {/* Search button */}
        <div className="p-2">
          <button
            type="submit"
            className="w-full sm:w-auto h-10 px-6 bg-blue text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-liteBlue transition-colors font-Poppins"
          >
            <BiSearchAlt className="text-lg" />
            Search
          </button>
        </div>

      </div>
    </form>
  );
};

export default SearchBar;
