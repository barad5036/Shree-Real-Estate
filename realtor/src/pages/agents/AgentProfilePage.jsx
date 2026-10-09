import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetAgentProfileQuery,
  useGetAgentStatsQuery,
  useGetAgentReviewsQuery,
  useAddAgentReviewMutation,
} from "../../redux/services/api";
import PropertyCard from "../../components/property/PropertyCard";
import useFavorites from "../../utils/useFavorites";
import { HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { MdVerified, MdBlock } from "react-icons/md";
import { FaStar, FaBuilding, FaRegStar, FaLanguage, FaIdCard, FaMapMarkerAlt } from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi";

const Shimmer = ({ w = "100%", h = 16, rounded = 8 }) => (
  <div style={{
    width: w, height: h, borderRadius: rounded,
    background: "linear-gradient(90deg,#f0f3f7 25%,#e8ecf2 50%,#f0f3f7 75%)",
    backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite",
  }} />
);

const StarRating = ({ rating = 0, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map((s) =>
      s <= Math.round(rating)
        ? <FaStar key={s} style={{ color: "#f59e0b", fontSize: size }} />
        : <FaRegStar key={s} style={{ color: "#d1d5db", fontSize: size }} />
    )}
    <span className="text-sm font-bold ml-1" style={{ color: "#3A76DA" }}>
      {rating ? rating.toFixed(1) : "—"}
    </span>
  </div>
);

// ── Interactive star picker ───────────────────────────────────────────────────
const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
        >
          {s <= (hovered || value)
            ? <FaStar style={{ color: "#f59e0b", fontSize: 22 }} />
            : <FaRegStar style={{ color: "#d1d5db", fontSize: 22 }} />
          }
        </button>
      ))}
    </div>
  );
};

// ── Contact modal ─────────────────────────────────────────────────────────────
const ContactModal = ({ agent, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center px-4"
    style={{ background: "rgba(0,4,10,0.55)", backdropFilter: "blur(4px)" }}
    onClick={onClose}
  >
    <div
      className="bg-white rounded-3xl w-full max-w-md p-7 relative"
      style={{ boxShadow: "0 24px 64px rgba(58,118,218,0.22)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold"
        style={{ background: "#f0f3f7", color: "#666565", border: "none", cursor: "pointer" }}>×</button>
      <h3 className="font-Poppins font-bold text-lg text-black mb-1">Contact Agent</h3>
      <p className="text-sm mb-5" style={{ color: "#666565" }}>Reach out to {agent.name} directly</p>
      <div className="flex flex-col gap-3">
        {agent.phone && (
          <a href={`tel:${agent.phone}`} className="flex items-center gap-3 p-3 rounded-2xl font-medium text-sm"
            style={{ background: "#f0f3f7", color: "#00040a", textDecoration: "none" }}>
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#3A76DA,#8bace2)" }}>
              <HiOutlinePhone className="text-white text-base" />
            </span>
            {agent.phone}
          </a>
        )}
        {agent.email && (
          <a href={`mailto:${agent.email}`} className="flex items-center gap-3 p-3 rounded-2xl font-medium text-sm"
            style={{ background: "#f0f3f7", color: "#00040a", textDecoration: "none" }}>
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#3A76DA,#8bace2)" }}>
              <HiOutlineMail className="text-white text-base" />
            </span>
            {agent.email}
          </a>
        )}
      </div>
    </div>
  </div>
);

// ── Reviews section ───────────────────────────────────────────────────────────
const ReviewsSection = ({ agentId }) => {
  const user = useSelector((s) => s.auth.user);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  const { data: reviewsData, isFetching: reviewsLoading } = useGetAgentReviewsQuery(agentId);
  const [addReview, { isLoading: submitting }] = useAddAgentReviewMutation();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");

  const reviews = reviewsData?.reviews || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return setMsg("Please select a star rating.");
    const res = await addReview({ id: agentId, rating, comment });
    if (!res.error) {
      setMsg("Review submitted! Thank you.");
      setRating(0);
      setComment("");
      setTimeout(() => setMsg(""), 3000);
    } else {
      setMsg(res.error?.data?.message || "Failed to submit review.");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 mt-6" style={{ boxShadow: "0 4px 20px rgba(58,118,218,0.08)" }}>
      <h3 className="font-Poppins font-bold text-black text-lg mb-5">
        Reviews
        <span className="ml-2 text-sm font-semibold px-2.5 py-0.5 rounded-full"
          style={{ background: "rgba(58,118,218,0.1)", color: "#3A76DA" }}>
          {reviews.length}
        </span>
      </h3>

      {/* Write review */}
      {isAuthenticated && user?.role !== "broker" && user?._id !== agentId && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-2xl flex flex-col gap-3"
          style={{ background: "#f0f3f7" }}>
          <p className="text-sm font-semibold text-black">Write a Review</p>
          <StarPicker value={rating} onChange={setRating} />
          <textarea
            rows={3}
            placeholder="Share your experience with this agent…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full text-sm rounded-xl px-3 py-2.5 resize-none outline-none"
            style={{ border: "1.5px solid #e2e8f0" }}
          />
          {msg && (
            <p className="text-xs font-semibold" style={{ color: msg.includes("Thank") ? "#15803d" : "#dc2626" }}>
              {msg}
            </p>
          )}
          <button type="submit" disabled={submitting}
            className="self-start text-white text-sm font-bold px-5 py-2 rounded-xl"
            style={{ background: "linear-gradient(135deg,#3A76DA,#8bace2)", border: "none", cursor: submitting ? "wait" : "pointer", opacity: submitting ? 0.75 : 1 }}>
            {submitting ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      )}

      {/* Review list */}
      {reviewsLoading ? (
        <div className="flex flex-col gap-3">
          {[1,2].map((i) => <Shimmer key={i} h={72} rounded={12} />)}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm italic text-center py-6" style={{ color: "#8bace2" }}>
          No reviews yet. Be the first to review this agent!
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => {
            const reviewerAvatar = r.user?.avatar
              ? r.user.avatar
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user?.name || "U")}&background=8bace2&color=fff&size=64`;
            return (
              <div key={r._id} className="flex gap-3 p-4 rounded-2xl" style={{ background: "#fafbfc" }}>
                <img src={reviewerAvatar} alt={r.user?.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  style={{ border: "2px solid #e2e8f0" }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-black">{r.user?.name || "Anonymous"}</p>
                    <p className="text-xs" style={{ color: "#666565" }}>
                      {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 mt-0.5 mb-1">
                    {[1,2,3,4,5].map((s) =>
                      s <= r.rating
                        ? <FaStar key={s} style={{ color: "#f59e0b", fontSize: 12 }} />
                        : <FaRegStar key={s} style={{ color: "#d1d5db", fontSize: 12 }} />
                    )}
                  </div>
                  {r.comment && <p className="text-sm leading-relaxed" style={{ color: "#666565" }}>{r.comment}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const AgentProfilePage = () => {
  const { id } = useParams();
  const [showContact, setShowContact] = useState(false);
  const { favorites, toggle: toggleFavorite } = useFavorites();

  const { data, isFetching, isError } = useGetAgentProfileQuery(id);
  const { data: statsData } = useGetAgentStatsQuery(id);

  const agent      = data?.agent;
  const properties = data?.properties || [];
  const stats      = statsData;

  const avatar = agent?.avatar
    ? agent.avatar
    : agent
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=3A76DA&color=fff&size=256`
      : null;

  if (isError) return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#f0f3f7" }}>
      <p className="text-5xl mb-4">😕</p>
      <p className="font-bold text-lg text-black">Agent not found</p>
      <Link to="/agents" className="mt-4 text-sm font-bold px-5 py-2.5 rounded-2xl text-white"
        style={{ background: "linear-gradient(135deg,#3A76DA,#8bace2)" }}>← Back to Agents</Link>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#f0f3f7" }}>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1a4fa0 0%,#3A76DA 60%,#8bace2 100%)", paddingBottom: 80, paddingTop: 56 }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 80% 40%,rgba(255,255,255,0.07) 0%,transparent 65%)" }} />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <Link to="/agents" className="inline-flex items-center gap-2 text-sm font-semibold mb-6"
            style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>
            <BiArrowBack /> All Agents
          </Link>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              {isFetching
                ? <div className="w-28 h-28 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
                : <img src={avatar} alt={agent?.name} className="w-28 h-28 rounded-full object-cover"
                    style={{ border: "4px solid rgba(255,255,255,0.9)", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }} />
              }
            </div>
            <div className="flex-1">
              {isFetching ? (
                <div className="flex flex-col gap-3">
                  <Shimmer w={200} h={28} rounded={8} />
                  <Shimmer w={160} h={18} rounded={6} />
                  <Shimmer w={120} h={16} rounded={6} />
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h1 className="font-Poppins font-bold text-white" style={{ fontSize: "clamp(1.4rem,3vw,2rem)" }}>
                      {agent?.name}
                    </h1>
                    {agent?.isVerified && (
                      <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(255,255,255,0.2)", color: "#fff", backdropFilter: "blur(8px)" }}>
                        <MdVerified /> Verified
                      </span>
                    )}
                    {agent?.isBlocked && (
                      <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(220,38,38,0.3)", color: "#fff" }}>
                        <MdBlock /> Blocked
                      </span>
                    )}
                  </div>
                  {agent?.companyName && (
                    <p className="flex items-center gap-1.5 text-sm font-semibold mb-1"
                      style={{ color: "rgba(255,255,255,0.85)" }}>
                      <FaBuilding className="flex-shrink-0" /> {agent.companyName}
                    </p>
                  )}
                  {agent?.location && (
                    <p className="flex items-center gap-1.5 text-sm mb-2"
                      style={{ color: "rgba(255,255,255,0.75)" }}>
                      <HiOutlineLocationMarker className="flex-shrink-0" /> {agent.location}
                    </p>
                  )}
                  <StarRating rating={agent?.rating} />
                  {agent?.totalReviews > 0 && (
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {agent.totalReviews} review{agent.totalReviews !== 1 ? "s" : ""}
                    </p>
                  )}
                  {agent?.reraId && (
                    <p className="flex items-center gap-1.5 text-xs mt-2 font-medium"
                      style={{ color: "rgba(255,255,255,0.7)" }}>
                      <FaIdCard className="flex-shrink-0" /> RERA: {agent.reraId}
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="flex-shrink-0 self-start md:self-center">
              <button onClick={() => setShowContact(true)}
                className="text-sm font-bold px-6 py-3 rounded-2xl"
                style={{ background: "#fff", color: "#3A76DA", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)"; }}>
                📞 Contact Agent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats cards ── */}
      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Listings", value: stats?.listings ?? "—", icon: "🏠" },
            { label: "Approved",       value: stats?.approved ?? "—", icon: "✅" },
            { label: "Leads Received", value: stats?.leads    ?? "—", icon: "📩" },
            { label: "Experience",     value: agent?.experience ? `${agent.experience} yrs` : "—", icon: "🏆" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-white rounded-2xl p-4 text-center"
              style={{ boxShadow: "0 4px 20px rgba(58,118,218,0.1)" }}>
              <p className="text-2xl mb-1">{icon}</p>
              <p className="font-bold text-xl text-black">{isFetching ? "—" : value}</p>
              <p className="text-xs mt-0.5" style={{ color: "#666565" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left sidebar ── */}
          <div className="flex flex-col gap-5 lg:w-72 flex-shrink-0">

            {/* About / Bio */}
            <div className="bg-white rounded-3xl p-6" style={{ boxShadow: "0 4px 20px rgba(58,118,218,0.08)" }}>
              <h3 className="font-Poppins font-bold text-black mb-3">About</h3>
              {isFetching
                ? <div className="flex flex-col gap-2"><Shimmer /><Shimmer w="85%" /><Shimmer w="70%" /></div>
                : agent?.bio
                  ? <p className="text-sm leading-relaxed" style={{ color: "#666565" }}>{agent.bio}</p>
                  : <p className="text-sm italic" style={{ color: "#8bace2" }}>No bio provided.</p>
              }
            </div>

            {/* Details */}
            {!isFetching && (
              <div className="bg-white rounded-3xl p-6 flex flex-col gap-3" style={{ boxShadow: "0 4px 20px rgba(58,118,218,0.08)" }}>
                <h3 className="font-Poppins font-bold text-black mb-1">Details</h3>
                {agent?.officeAddress && (
                  <div className="flex items-start gap-2 text-sm" style={{ color: "#666565" }}>
                    <FaMapMarkerAlt className="flex-shrink-0 mt-0.5" style={{ color: "#3A76DA" }} />
                    <span>{agent.officeAddress}</span>
                  </div>
                )}
                {agent?.languages?.length > 0 && (
                  <div className="flex items-start gap-2 text-sm" style={{ color: "#666565" }}>
                    <FaLanguage className="flex-shrink-0 mt-0.5 text-base" style={{ color: "#3A76DA" }} />
                    <span>{agent.languages.join(", ")}</span>
                  </div>
                )}
                {agent?.serviceAreas?.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold" style={{ color: "#666565" }}>Service Areas</p>
                    <div className="flex flex-wrap gap-1.5">
                      {agent.serviceAreas.map((a) => (
                        <span key={a} className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: "#f0f3f7", color: "#3A76DA" }}>{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Specializations */}
            {(isFetching || agent?.specialization?.length > 0) && (
              <div className="bg-white rounded-3xl p-6" style={{ boxShadow: "0 4px 20px rgba(58,118,218,0.08)" }}>
                <h3 className="font-Poppins font-bold text-black mb-3">Specializations</h3>
                {isFetching
                  ? <div className="flex flex-wrap gap-2"><Shimmer w={80} h={28} rounded={20} /><Shimmer w={100} h={28} rounded={20} /></div>
                  : (
                    <div className="flex flex-wrap gap-2">
                      {agent.specialization.map((s) => (
                        <span key={s} className="text-xs font-semibold px-3 py-1.5 rounded-full"
                          style={{ background: "linear-gradient(135deg,rgba(58,118,218,0.1),rgba(139,172,226,0.15))", color: "#3A76DA" }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )
                }
              </div>
            )}

            {/* Contact card */}
            <div className="bg-white rounded-3xl p-6" style={{ boxShadow: "0 4px 20px rgba(58,118,218,0.08)" }}>
              <h3 className="font-Poppins font-bold text-black mb-4">Get in Touch</h3>
              <div className="flex flex-col gap-3">
                {agent?.phone && (
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-3 text-sm font-medium"
                    style={{ color: "#00040a", textDecoration: "none" }}>
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#3A76DA,#8bace2)" }}>
                      <HiOutlinePhone className="text-white" />
                    </span>
                    {agent.phone}
                  </a>
                )}
                {agent?.email && (
                  <a href={`mailto:${agent.email}`} className="flex items-center gap-3 text-sm font-medium"
                    style={{ color: "#00040a", textDecoration: "none" }}>
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#3A76DA,#8bace2)" }}>
                      <HiOutlineMail className="text-white" />
                    </span>
                    {agent.email}
                  </a>
                )}
              </div>
              <button onClick={() => setShowContact(true)}
                className="w-full mt-5 text-sm font-bold py-2.5 rounded-2xl text-white"
                style={{ background: "linear-gradient(135deg,#3A76DA,#8bace2)", border: "none", cursor: "pointer", transition: "opacity 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                Contact Agent
              </button>
            </div>
          </div>

          {/* ── Right: Listings + Reviews ── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-Poppins font-bold text-black text-lg">
                Active Listings
                {!isFetching && (
                  <span className="ml-2 text-sm font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ background: "rgba(58,118,218,0.1)", color: "#3A76DA" }}>
                    {properties.length}
                  </span>
                )}
              </h3>
            </div>

            {isFetching ? (
              <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))" }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden"
                    style={{ boxShadow: "0 4px 20px rgba(58,118,218,0.07)" }}>
                    <div style={{ height: 180, background: "linear-gradient(90deg,#f0f3f7 25%,#e8ecf2 50%,#f0f3f7 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
                    <div className="p-4 flex flex-col gap-2">
                      <Shimmer w="70%" h={14} /><Shimmer w="90%" h={12} /><Shimmer w="50%" h={12} />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center"
                style={{ boxShadow: "0 4px 20px rgba(58,118,218,0.08)" }}>
                <p className="text-4xl mb-3">🏠</p>
                <p className="font-bold text-black">No active listings</p>
                <p className="text-sm mt-1" style={{ color: "#666565" }}>This agent has no approved properties yet.</p>
              </div>
            ) : (
              <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))" }}>
                {properties.map((p) => (
                  <PropertyCard key={p._id} property={p}
                    isFavorite={favorites.includes(p._id)} onToggleFavorite={toggleFavorite} />
                ))}
              </div>
            )}

            {/* Reviews */}
            <ReviewsSection agentId={id} />
          </div>
        </div>
      </div>

      {showContact && agent && <ContactModal agent={agent} onClose={() => setShowContact(false)} />}
    </div>
  );
};

export default AgentProfilePage;
