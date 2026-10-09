import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FilterSidebar from "../../components/search/FilterSidebar";
import PropertyGrid from "../../components/property/PropertyGrid";
import SearchBar from "../../components/search/SearchBar";
import Footer from "../../components/Layout/Footer";
import Error from "../../components/UI/Error";
import { useGetPropertiesQuery } from "../../redux/services/api";
import { MdChevronLeft, MdChevronRight, MdTune } from "react-icons/md";

const DEFAULT_FILTERS = {
  search: "",
  listingType: "",
  propertyType: "",
  city: "",
  maxPrice: "",
  minBedrooms: "",
  minArea: "",
};

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchPage = () => {
  const query = useQuery();
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    listingType: query.get("listingType") || "",
    propertyType: query.get("propertyType") || "",
    city: query.get("city") || "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  // Sync URL query params into filters whenever the URL changes
  // (e.g. user submits SearchBar while already on /search)
  const location = useLocation();
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    setFilters((prev) => ({
      ...prev,
      city:        q.get("city")        || "",
      listingType: q.get("listingType") || "",
      propertyType:q.get("propertyType")|| "",
    }));
    setPage(1);
  }, [location.search]);

  useEffect(() => { setPage(1); }, [filters]);

  const apiParams = { page, limit: 12 };
  if (filters.search)       apiParams.search       = filters.search;
  if (filters.city)         apiParams.city         = filters.city;
  if (filters.listingType)  apiParams.listingType  = filters.listingType;
  if (filters.propertyType) apiParams.propertyType = filters.propertyType;
  if (filters.maxPrice)     apiParams.maxPrice     = filters.maxPrice;
  if (filters.minBedrooms)  apiParams.minBedrooms  = filters.minBedrooms;
  if (filters.minArea)      apiParams.minArea      = filters.minArea;

  const { data, isLoading, error } = useGetPropertiesQuery(apiParams);
  const properties  = data?.properties || [];
  const totalPages  = data?.pages || 1;
  const total       = data?.total || 0;

  if (error) return <Error />;

  return (
    <div className="min-h-screen pt-20" style={{ background: "#f0f3f7" }}>
      {/* Search bar */}
      <div style={{ background: "linear-gradient(135deg, #3A76DA 0%, #8bace2 100%)", padding: "28px 0 36px" }}>
        <div className="px-4 md:px-10 lg:px-20">
          <p className="font-Poppins font-bold text-white text-2xl mb-4">
            Find Your Perfect Property
          </p>
          <SearchBar defaultCity={filters.city} defaultType={filters.listingType} />
        </div>
      </div>

      <div className="px-4 md:px-10 lg:px-20 py-8">
        {/* Result count + mobile filter toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="font-Poppins">
            {isLoading ? (
              <div className="h-4 w-40 rounded-full" style={{ background: "#e8ecf2" }} />
            ) : (
              <p className="text-sm" style={{ color: "#666565" }}>
                <span className="font-bold text-black text-base">{total}</span>
                <span className="ml-1">properties found</span>
                {totalPages > 1 && (
                  <span className="ml-2" style={{ color: "#8bace2" }}>· Page {page} of {totalPages}</span>
                )}
              </p>
            )}
          </div>

          <button
            onClick={() => setShowFilters((v) => !v)}
            className="lg:hidden flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-2xl font-Poppins"
            style={{
              background: showFilters ? "linear-gradient(135deg,#3A76DA,#8bace2)" : "#fff",
              color: showFilters ? "#fff" : "#3A76DA",
              boxShadow: "0 4px 12px rgba(58,118,218,0.15)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <MdTune className="text-lg" />
            {showFilters ? "Hide Filters" : "Filters"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className={`w-full lg:w-72 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />
          </div>

          {/* Grid */}
          <div className="flex-1">
            <PropertyGrid
              properties={properties}
              isLoading={isLoading}
              emptyMessage="No properties match your filters. Try adjusting them."
            />

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 font-Poppins">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "#fff", color: "#3A76DA", boxShadow: "0 2px 8px rgba(58,118,218,0.10)", border: "none", cursor: "pointer" }}
                >
                  <MdChevronLeft className="text-lg" /> Prev
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "..." ? (
                        <span key={`e-${idx}`} className="px-3 py-2 text-ash text-sm">…</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setPage(item)}
                          className="w-10 h-10 rounded-2xl text-sm font-bold transition-all"
                          style={{
                            background: page === item ? "linear-gradient(135deg,#3A76DA,#8bace2)" : "#fff",
                            color: page === item ? "#fff" : "#666565",
                            boxShadow: page === item ? "0 4px 12px rgba(58,118,218,0.25)" : "0 2px 8px rgba(58,118,218,0.08)",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {item}
                        </button>
                      )
                    )}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "#fff", color: "#3A76DA", boxShadow: "0 2px 8px rgba(58,118,218,0.10)", border: "none", cursor: "pointer" }}
                >
                  Next <MdChevronRight className="text-lg" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
