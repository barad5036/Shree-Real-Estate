import React, { useState, useEffect } from "react";
import { PROPERTY_TYPES, LISTING_TYPES } from "../../data/mockProperties";
import { MdTune, MdRefresh } from "react-icons/md";
import { HiOutlineSearch } from "react-icons/hi";

const FilterSidebar = ({ filters, onChange, onReset }) => {
  const handle = (key, value) => onChange({ ...filters, [key]: value });

  // Debounce text inputs — only fire after 400 ms idle
  const [searchDraft,   setSearchDraft]   = useState(filters.search   || "");
  const [cityDraft,     setCityDraft]     = useState(filters.city     || "");
  const [maxPriceDraft, setMaxPriceDraft] = useState(filters.maxPrice || "");
  const [minAreaDraft,  setMinAreaDraft]  = useState(filters.minArea  || "");

  // Sync drafts when parent resets filters
  useEffect(() => { setSearchDraft(filters.search   || ""); }, [filters.search]);
  useEffect(() => { setCityDraft(filters.city       || ""); }, [filters.city]);
  useEffect(() => { setMaxPriceDraft(filters.maxPrice || ""); }, [filters.maxPrice]);
  useEffect(() => { setMinAreaDraft(filters.minArea  || ""); }, [filters.minArea]);

  useEffect(() => {
    const t = setTimeout(() => handle("search", searchDraft), 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft]);

  useEffect(() => {
    const t = setTimeout(() => handle("city", cityDraft), 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityDraft]);

  useEffect(() => {
    const t = setTimeout(() => handle("maxPrice", maxPriceDraft), 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxPriceDraft]);

  useEffect(() => {
    const t = setTimeout(() => handle("minArea", minAreaDraft), 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minAreaDraft]);

  const sectionTitle = (label) => (
    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#8bace2" }}>
      {label}
    </p>
  );

  const pill = (label, active, onClick) => (
    <button
      key={label}
      onClick={onClick}
      className="text-xs font-semibold px-3 py-2 rounded-xl transition-all font-Poppins"
      style={{
        background: active ? "linear-gradient(135deg, #3A76DA, #8bace2)" : "#f0f3f7",
        color: active ? "#fff" : "#666565",
        border: "none",
        cursor: "pointer",
        transform: active ? "scale(1.04)" : "scale(1)",
        boxShadow: active ? "0 4px 12px rgba(58,118,218,0.25)" : "none",
        transition: "all 0.2s ease",
      }}
    >
      {label}
    </button>
  );

  return (
    <aside
      className="rounded-3xl p-5 font-Poppins sticky top-24"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(58,118,218,0.10)",
        border: "1px solid rgba(240,243,247,0.8)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3A76DA, #8bace2)" }}
          >
            <MdTune className="text-white text-base" />
          </div>
          <h2 className="font-bold text-black text-base">Filters</h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
          style={{
            color: "#3A76DA",
            background: "#f0f3f7",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#e8ecf2")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#f0f3f7")}
        >
          <MdRefresh className="text-sm" /> Reset
        </button>
      </div>

      {/* Keyword Search */}
      <div className="mb-6">
        {sectionTitle("Keyword Search")}
        <div className="relative">
          <HiOutlineSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none"
            style={{ color: "#8bace2" }}
          />
          <input
            type="text"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Title, address, description…"
            className="w-full text-sm font-Poppins"
            style={{
              border: "2px solid #f0f3f7",
              borderRadius: 12,
              padding: "10px 14px 10px 36px",
              outline: "none",
              transition: "border-color 0.2s",
              background: "#fafbfc",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#3A76DA")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#f0f3f7")}
          />
        </div>
      </div>

      <div className="mb-6" style={{ height: 1, background: "#f0f3f7" }} />

      {/* Listing Type */}
      <div className="mb-6">
        {sectionTitle("Listing Type")}
        <div className="flex gap-2">
          {[["", "All"], [LISTING_TYPES.SALE, "Buy"], [LISTING_TYPES.RENT, "Rent"]].map(([val, label]) =>
            pill(label, filters.listingType === val, () => handle("listingType", val))
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mb-6" style={{ height: 1, background: "#f0f3f7" }} />

      {/* Property Type */}
      <div className="mb-6">
        {sectionTitle("Property Type")}
        <div className="flex flex-wrap gap-2">
          {pill("All", filters.propertyType === "", () => handle("propertyType", ""))}
          {Object.values(PROPERTY_TYPES).map((type) =>
            pill(type, filters.propertyType === type, () => handle("propertyType", type))
          )}
        </div>
      </div>

      <div className="mb-6" style={{ height: 1, background: "#f0f3f7" }} />

      {/* City */}
      <div className="mb-6">
        {sectionTitle("City")}
        <input
          type="text"
          value={cityDraft}
          onChange={(e) => setCityDraft(e.target.value)}
          placeholder="e.g. Pune, Mumbai..."
          className="w-full text-sm font-Poppins"
          style={{
            border: "2px solid #f0f3f7",
            borderRadius: 12,
            padding: "10px 14px",
            outline: "none",
            transition: "border-color 0.2s",
            background: "#fafbfc",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#3A76DA")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#f0f3f7")}
        />
      </div>

      <div className="mb-6" style={{ height: 1, background: "#f0f3f7" }} />

      {/* Max Price */}
      <div className="mb-6">
        {sectionTitle("Max Price (₹)")}
        <input
          type="number"
          value={maxPriceDraft}
          onChange={(e) => setMaxPriceDraft(e.target.value)}
          placeholder="e.g. 5000000"
          className="w-full text-sm font-Poppins"
          style={{
            border: "2px solid #f0f3f7",
            borderRadius: 12,
            padding: "10px 14px",
            outline: "none",
            transition: "border-color 0.2s",
            background: "#fafbfc",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#3A76DA")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#f0f3f7")}
        />
      </div>

      <div className="mb-6" style={{ height: 1, background: "#f0f3f7" }} />

      {/* Bedrooms */}
      <div className="mb-6">
        {sectionTitle("Min Bedrooms")}
        <div className="flex gap-2">
          {[["", "Any"], ["1", "1+"], ["2", "2+"], ["3", "3+"], ["4", "4+"]].map(([val, label]) =>
            pill(label, filters.minBedrooms === val, () => handle("minBedrooms", val))
          )}
        </div>
      </div>

      <div className="mb-6" style={{ height: 1, background: "#f0f3f7" }} />

      {/* Min Area */}
      <div>
        {sectionTitle("Min Area (sqft)")}
        <input
          type="number"
          value={minAreaDraft}
          onChange={(e) => setMinAreaDraft(e.target.value)}
          placeholder="e.g. 500"
          className="w-full text-sm font-Poppins"
          style={{
            border: "2px solid #f0f3f7",
            borderRadius: 12,
            padding: "10px 14px",
            outline: "none",
            transition: "border-color 0.2s",
            background: "#fafbfc",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#3A76DA")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#f0f3f7")}
        />
      </div>
    </aside>
  );
};

export default FilterSidebar;
