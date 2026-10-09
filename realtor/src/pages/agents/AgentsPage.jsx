import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAgentsQuery } from "../../redux/services/api";
import { HiOutlineLocationMarker, HiOutlineSearch } from "react-icons/hi";
import { MdVerified } from "react-icons/md";
import { FaStar, FaBuilding } from "react-icons/fa";
import CustomDropdown from "../../components/UI/CustomDropdown";

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonAgentCard = () => (
  <div className="bg-white rounded-3xl p-6 flex flex-col items-center gap-3"
    style={{ boxShadow: "0 4px 24px rgba(58,118,218,0.07)" }}>
    <div className="w-24 h-24 rounded-full"
      style={{ background: "linear-gradient(90deg,#f0f3f7 25%,#e8ecf2 50%,#f0f3f7 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
    {[80, 60, 100, 40].map((w, i) => (
      <div key={i} className="rounded-full h-3"
        style={{ width: `${w}%`, background: "linear-gradient(90deg,#f0f3f7 25%,#e8ecf2 50%,#f0f3f7 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
    ))}
  </div>
);

// ── Agent card ────────────────────────────────────────────────────────────────
const AgentCard = ({ agent }) => {
  const [hovered, setHovered] = useState(false);
  const avatar = agent.avatar
    ? agent.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=3A76DA&color=fff&size=128`;

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden flex flex-col"
      style={{
        boxShadow: hovered ? "0 20px 56px rgba(58,118,218,0.18)" : "0 4px 24px rgba(58,118,218,0.08)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top gradient banner */}
      <div className="relative h-20" style={{ background: "linear-gradient(135deg,#3A76DA 0%,#8bace2 100%)" }}>
        {agent.isVerified && (
          <span className="absolute top-3 right-3 flex items-center gap-1 text-white text-xs font-bold px-2 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.22)", backdropFilter: "blur(8px)" }}>
            <MdVerified className="text-sm" /> Verified
          </span>
        )}
        {agent.totalListings > 0 && (
          <span className="absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded-full"
            style={{ background: "rgba(0,0,0,0.28)", backdropFilter: "blur(8px)" }}>
            {agent.totalListings} Listings
          </span>
        )}
      </div>

      {/* Avatar — overlaps banner */}
      <div className="flex flex-col items-center px-5 pb-5" style={{ marginTop: -40 }}>
        <img
          src={avatar}
          alt={agent.name}
          className="w-20 h-20 rounded-full object-cover"
          style={{ border: "3px solid #fff", boxShadow: "0 4px 16px rgba(58,118,218,0.22)" }}
        />

        <h2 className="font-Poppins font-bold text-black text-base mt-3 text-center leading-tight">
          {agent.name}
        </h2>

        {agent.companyName && (
          <p className="text-xs font-semibold mt-0.5 text-center flex items-center gap-1" style={{ color: "#3A76DA" }}>
            <FaBuilding className="flex-shrink-0" />
            {agent.companyName}
          </p>
        )}

        {agent.location && (
          <p className="text-xs mt-1 flex items-center gap-1 text-center" style={{ color: "#666565" }}>
            <HiOutlineLocationMarker className="flex-shrink-0" />
            {agent.location}
          </p>
        )}

        {/* Stats row */}
        <div className="flex items-center justify-center gap-4 mt-3 w-full py-3"
          style={{ borderTop: "1px solid #f0f3f7", borderBottom: "1px solid #f0f3f7" }}>
          <div className="flex flex-col items-center">
            <span className="font-bold text-sm text-black">{agent.experience || 0}</span>
            <span className="text-xs" style={{ color: "#666565" }}>Yrs Exp</span>
          </div>
          <div className="w-px h-8" style={{ background: "#f0f3f7" }} />
          <div className="flex flex-col items-center">
            <span className="font-bold text-sm flex items-center gap-0.5" style={{ color: "#3A76DA" }}>
              <FaStar className="text-xs" style={{ color: "#f59e0b" }} />
              {agent.rating ? agent.rating.toFixed(1) : "—"}
            </span>
            <span className="text-xs" style={{ color: "#666565" }}>{agent.totalReviews || 0} Reviews</span>
          </div>
          <div className="w-px h-8" style={{ background: "#f0f3f7" }} />
          <div className="flex flex-col items-center">
            <span className="font-bold text-sm text-black">{agent.totalListings}</span>
            <span className="text-xs" style={{ color: "#666565" }}>Listings</span>
          </div>
        </div>

        {/* Specializations */}
        {agent.specialization?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-center mt-3">
            {agent.specialization.slice(0, 3).map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: "#f0f3f7", color: "#3A76DA" }}>
                {s}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <Link to={`/agents/${agent._id}`} className="w-full mt-4">
          <button
            className="w-full text-sm font-bold py-2.5 rounded-2xl font-Poppins"
            style={{
              background: hovered
                ? "linear-gradient(135deg,#2d62c4 0%,#3A76DA 100%)"
                : "linear-gradient(135deg,#3A76DA 0%,#8bace2 100%)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              transition: "background 0.3s ease",
              letterSpacing: "0.02em",
            }}
          >
            View Profile →
          </button>
        </Link>
      </div>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const AgentsPage = () => {
  const [search, setSearch]       = useState("");
  const [city, setCity]           = useState("");
  const [minExp, setMinExp]       = useState("");
  const [minRating, setMinRating] = useState("");
  const [page, setPage]           = useState(1);

  // Committed filters (only applied on search submit / filter change)
  const [filters, setFilters] = useState({});

  const { data, isFetching, isError } = useGetAgentsQuery({ ...filters, page, limit: 12 });

  const agents = data?.agents || [];
  const totalPages = data?.pages || 1;

  const applyFilters = () => {
    setPage(1);
    setFilters({
      ...(search    && { search }),
      ...(city      && { city }),
      ...(minExp    && { minExp }),
      ...(minRating && { minRating }),
    });
  };

  const resetFilters = () => {
    setSearch(""); setCity(""); setMinExp(""); setMinRating("");
    setFilters({}); setPage(1);
  };

  return (
    <div className="min-h-screen" style={{ background: "#f0f3f7" }}>
      {/* ── Hero banner ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1a4fa0 0%,#3A76DA 50%,#8bace2 100%)", paddingTop: 72, paddingBottom: 56 }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 50%,rgba(255,255,255,0.08) 0%,transparent 70%)" }} />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "0.18em" }}>
            Our Experts
          </p>
          <h1 className="font-Poppins font-bold text-white mb-3"
            style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", lineHeight: 1.2 }}>
            Find Your Perfect <span style={{ color: "#c8d9f5" }}>Real Estate Agent</span>
          </h1>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.75)" }}>
            Connect with verified brokers who know your market inside out.
          </p>

          {/* Search bar */}
          <div className="flex items-center gap-2 mt-8 max-w-lg mx-auto bg-white rounded-2xl px-4 py-2"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
            <HiOutlineSearch className="text-xl flex-shrink-0" style={{ color: "#8bace2" }} />
            <input
              type="text"
              placeholder="Search by name, company or city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="flex-1 bg-transparent text-sm outline-none font-Poppins"
              style={{ color: "#00040a" }}
            />
            <button
              onClick={applyFilters}
              className="text-white text-xs font-bold px-4 py-2 rounded-xl"
              style={{ background: "linear-gradient(135deg,#3A76DA,#8bace2)", border: "none", cursor: "pointer" }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ── Filters row ── */}
      <div className="max-w-5xl mx-auto px-6 -mt-5 relative z-20">
        <div className="bg-white rounded-2xl px-5 py-4 flex flex-wrap gap-3 items-end"
          style={{ boxShadow: "0 4px 24px rgba(58,118,218,0.1)" }}>

          <div className="flex flex-col gap-1 flex-1" style={{ minWidth: 140 }}>
            <label className="text-xs font-semibold" style={{ color: "#666565" }}>City</label>
            <input
              type="text"
              placeholder="e.g. Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="border rounded-xl px-3 py-2 text-sm"
              style={{ borderColor: "#e2e8f0", outline: "none" }}
            />
          </div>

          <div className="flex flex-col gap-1" style={{ minWidth: 150 }}>
            <CustomDropdown
              label="Min Experience"
              placeholder="Any experience"
              value={minExp}
              onChange={(val) => { setMinExp(val); setPage(1); setFilters((f) => ({ ...f, minExp: val || undefined })); }}
              options={[
                { value: "",   label: "Any experience" },
                { value: "1",  label: "1+ years" },
                { value: "3",  label: "3+ years" },
                { value: "5",  label: "5+ years" },
                { value: "10", label: "10+ years" },
                { value: "15", label: "15+ years" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-1" style={{ minWidth: 150 }}>
            <CustomDropdown
              label="Min Rating"
              placeholder="Any rating"
              value={minRating}
              onChange={(val) => { setMinRating(val); setPage(1); setFilters((f) => ({ ...f, minRating: val || undefined })); }}
              options={[
                { value: "",    label: "Any rating" },
                { value: "3",   label: "⭐ 3.0+" },
                { value: "3.5", label: "⭐ 3.5+" },
                { value: "4",   label: "⭐ 4.0+" },
                { value: "4.5", label: "⭐ 4.5+" },
              ]}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="text-white text-sm font-bold px-5 py-2 rounded-xl"
              style={{ background: "linear-gradient(135deg,#3A76DA,#8bace2)", border: "none", cursor: "pointer" }}
            >
              Apply
            </button>
            {Object.keys(filters).length > 0 && (
              <button
                onClick={resetFilters}
                className="text-sm font-semibold px-4 py-2 rounded-xl border"
                style={{ borderColor: "#e2e8f0", color: "#666565", background: "#fff", cursor: "pointer" }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Count */}
        {!isFetching && !isError && (
          <p className="text-sm mb-5 font-medium" style={{ color: "#666565" }}>
            {data?.total || 0} agent{data?.total !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">😕</p>
            <p className="font-semibold text-black">Could not load agents</p>
            <p className="text-sm mt-1" style={{ color: "#666565" }}>Please check your connection and try again.</p>
          </div>
        )}

        {/* Grid */}
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>
          {isFetching
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonAgentCard key={i} />)
            : agents.map((agent) => <AgentCard key={agent._id} agent={agent} />)
          }
        </div>

        {/* Empty state */}
        {!isFetching && !isError && agents.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🏢</p>
            <p className="font-bold text-lg text-black">No agents found</p>
            <p className="text-sm mt-2" style={{ color: "#666565" }}>Try adjusting your filters or search term.</p>
            <button onClick={resetFilters} className="mt-5 text-sm font-bold px-6 py-2.5 rounded-2xl text-white"
              style={{ background: "linear-gradient(135deg,#3A76DA,#8bace2)", border: "none", cursor: "pointer" }}>
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!isFetching && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{
                background: page === 1 ? "#f0f3f7" : "linear-gradient(135deg,#3A76DA,#8bace2)",
                color: page === 1 ? "#666565" : "#fff",
                border: "none",
                cursor: page === 1 ? "default" : "pointer",
              }}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-9 h-9 rounded-xl text-sm font-bold"
                style={{
                  background: p === page ? "linear-gradient(135deg,#3A76DA,#8bace2)" : "#fff",
                  color: p === page ? "#fff" : "#3A76DA",
                  border: p === page ? "none" : "1.5px solid #3A76DA",
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{
                background: page === totalPages ? "#f0f3f7" : "linear-gradient(135deg,#3A76DA,#8bace2)",
                color: page === totalPages ? "#666565" : "#fff",
                border: "none",
                cursor: page === totalPages ? "default" : "pointer",
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentsPage;
