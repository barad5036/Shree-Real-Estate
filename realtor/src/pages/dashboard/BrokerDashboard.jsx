import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { MdEmail, MdPhone } from "react-icons/md";
import Footer from "../../components/Layout/Footer";
import {
  useGetMyPropertiesQuery,
  useGetMyLeadsQuery,
  useUpdateLeadStatusMutation,
  useUpdateBrokerProfileMutation,
} from "../../redux/services/api";

const LEAD_STATUS_STYLES = {
  new:       { bg: "#dbeafe", color: "#1d4ed8", label: "New" },
  contacted: { bg: "#fef9c3", color: "#a16207", label: "Contacted" },
  closed:    { bg: "#dcfce7", color: "#15803d", label: "Closed" },
};

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold" style={{ color: "#666565" }}>{label}</label>
    {children}
  </div>
);

const inputCls = "border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue transition-colors";
const inputStyle = { borderColor: "#e2e8f0" };

const BrokerDashboard = () => {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const user = useSelector((s) => s.auth.user);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: propData } = useGetMyPropertiesQuery();
  const { data: leadsData, isLoading: leadsLoading } = useGetMyLeadsQuery();
  const [updateLeadStatus] = useUpdateLeadStatusMutation();
  const [updateBrokerProfile, { isLoading: profileSaving }] = useUpdateBrokerProfileMutation();

  const [profileForm, setProfileForm] = useState({
    companyName:    user?.companyName    || "",
    experience:     user?.experience     || "",
    location:       user?.location       || "",
    bio:            user?.bio            || "",
    reraId:         user?.reraId         || "",
    officeAddress:  user?.officeAddress  || "",
    specialization: (user?.specialization || []).join(", "),
    serviceAreas:   (user?.serviceAreas   || []).join(", "),
    languages:      (user?.languages      || []).join(", "),
  });
  const [profileMsg, setProfileMsg] = useState("");

  const myProperties  = propData?.properties || [];
  const recentProperties = myProperties.slice(0, 3);
  const leads         = leadsData?.leads || [];
  const approvedCount = myProperties.filter((p) => p.status === "approved").length;
  const pendingCount  = myProperties.filter((p) => p.status === "pending").length;
  const newLeadsCount = leads.filter((l) => l.status === "new").length;

  if (!isAuthenticated) return <Redirect to="/login" />;

  const handleStatusChange = async (leadId, status) => {
    await updateLeadStatus({ id: leadId, status });
  };

  const splitCSV = (str) => str.split(",").map((s) => s.trim()).filter(Boolean);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      companyName:   profileForm.companyName,
      experience:    Number(profileForm.experience) || 0,
      location:      profileForm.location,
      bio:           profileForm.bio,
      reraId:        profileForm.reraId,
      officeAddress: profileForm.officeAddress,
      specialization: splitCSV(profileForm.specialization),
      serviceAreas:   splitCSV(profileForm.serviceAreas),
      languages:      splitCSV(profileForm.languages),
    };
    await updateBrokerProfile(payload);
    setProfileMsg("Profile saved successfully!");
    setTimeout(() => setProfileMsg(""), 3000);
  };

  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "leads",    label: `Leads${newLeadsCount > 0 ? ` (${newLeadsCount})` : ""}` },
    { key: "profile",  label: "My Profile" },
  ];

  return (
    <div className="bg-silver min-h-screen pt-20">
      <div className="px-4 md:px-10 lg:px-20 py-8">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 font-Poppins flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-bold text-xl text-black mb-1">Broker Dashboard</h1>
            <p className="text-ash text-sm">{user?.name} · {user?.email}</p>
          </div>
          <div className="flex gap-3 items-center">
            <Link to={`/agents/${user?._id}`}>
              <button className="border-2 border-blue text-blue font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue hover:text-white transition-colors">
                My Public Profile
              </button>
            </Link>
            <Link to="/dashboard/broker/add-property">
              <button className="bg-blue text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-liteBlue transition-colors">
                + Add New Property
              </button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`text-sm font-semibold px-5 py-2 rounded-xl transition-colors font-Poppins ${
                activeTab === t.key ? "bg-blue text-white" : "bg-white text-ash shadow-sm hover:text-blue"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Listings",  value: myProperties.length },
                { label: "Approved",        value: approvedCount },
                { label: "Pending Review",  value: pendingCount },
                { label: "New Enquiries",   value: newLeadsCount },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl shadow-md p-5 font-Poppins text-center">
                  <p className="text-2xl font-bold text-blue">{stat.value}</p>
                  <p className="text-ash text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Link to="/dashboard/broker/add-property">
                <div className="bg-blue text-white rounded-2xl p-6 font-Poppins hover:opacity-90 transition-opacity">
                  <p className="font-bold text-lg mb-1">Add Property</p>
                  <p className="text-sm opacity-80">List a new property for sale or rent</p>
                </div>
              </Link>
              <Link to="/dashboard/broker/my-properties">
                <div className="bg-white rounded-2xl shadow-md p-6 font-Poppins hover:shadow-lg transition-shadow">
                  <p className="font-bold text-lg text-black mb-1">My Properties</p>
                  <p className="text-ash text-sm">Manage your active listings</p>
                </div>
              </Link>
            </div>

            {recentProperties.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-Poppins font-bold text-black text-base">Recent Listings</h2>
                  <Link to="/dashboard/broker/my-properties" className="text-blue text-sm hover:underline font-medium">View All</Link>
                </div>
                <div className="bg-white rounded-2xl shadow-md overflow-hidden font-Poppins">
                  {recentProperties.map((p, i) => (
                    <div key={p._id} className={`flex items-center gap-3 p-4 ${i !== recentProperties.length - 1 ? "border-b border-silver" : ""}`}>
                      {p.images?.[0]
                        ? <img src={p.images[0]} alt={p.title} className="w-14 h-10 object-cover rounded-lg flex-shrink-0" />
                        : <div className="w-14 h-10 bg-silver rounded-lg flex-shrink-0" />
                      }
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-black text-sm truncate">{p.title}</p>
                        <p className="text-ash text-xs truncate">{p.city} · {p.propertyType}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-blue font-bold text-sm">₹{p.price.toLocaleString("en-IN")}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                          backgroundColor: p.status === "approved" ? "#dcfce7" : p.status === "pending" ? "#fef9c3" : "#fee2e2",
                          color: p.status === "approved" ? "#15803d" : p.status === "pending" ? "#a16207" : "#dc2626",
                        }}>{p.status}</span>
                      </div>
                      <Link to={`/property/${p._id}`} className="text-blue text-xs hover:underline flex-shrink-0">View</Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── PROFILE ── */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl shadow-md p-6 font-Poppins max-w-2xl">
            <h2 className="font-bold text-black text-base mb-1">Broker Profile</h2>
            <p className="text-ash text-xs mb-5">This info appears on your public agent page.</p>

            {profileMsg && (
              <div className="mb-4 text-sm font-medium px-4 py-2.5 rounded-xl"
                style={{ background: "#dcfce7", color: "#15803d" }}>{profileMsg}</div>
            )}

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Company Name">
                  <input type="text" placeholder="e.g. Shree Realty" value={profileForm.companyName}
                    onChange={(e) => setProfileForm((f) => ({ ...f, companyName: e.target.value }))}
                    className={inputCls} style={inputStyle} />
                </Field>
                <Field label="Experience (years)">
                  <input type="number" placeholder="e.g. 5" value={profileForm.experience}
                    onChange={(e) => setProfileForm((f) => ({ ...f, experience: e.target.value }))}
                    className={inputCls} style={inputStyle} />
                </Field>
                <Field label="City / Location">
                  <input type="text" placeholder="e.g. Mumbai" value={profileForm.location}
                    onChange={(e) => setProfileForm((f) => ({ ...f, location: e.target.value }))}
                    className={inputCls} style={inputStyle} />
                </Field>
                <Field label="RERA ID">
                  <input type="text" placeholder="e.g. MH/12345/2023" value={profileForm.reraId}
                    onChange={(e) => setProfileForm((f) => ({ ...f, reraId: e.target.value }))}
                    className={inputCls} style={inputStyle} />
                </Field>
              </div>

              <Field label="Office Address">
                <input type="text" placeholder="e.g. 101, Business Park, Andheri West, Mumbai" value={profileForm.officeAddress}
                  onChange={(e) => setProfileForm((f) => ({ ...f, officeAddress: e.target.value }))}
                  className={inputCls} style={inputStyle} />
              </Field>

              <Field label="Specializations (comma-separated)">
                <input type="text" placeholder="e.g. Residential, Commercial, Luxury" value={profileForm.specialization}
                  onChange={(e) => setProfileForm((f) => ({ ...f, specialization: e.target.value }))}
                  className={inputCls} style={inputStyle} />
              </Field>

              <Field label="Service Areas / Cities (comma-separated)">
                <input type="text" placeholder="e.g. Mumbai, Pune, Thane" value={profileForm.serviceAreas}
                  onChange={(e) => setProfileForm((f) => ({ ...f, serviceAreas: e.target.value }))}
                  className={inputCls} style={inputStyle} />
              </Field>

              <Field label="Languages Spoken (comma-separated)">
                <input type="text" placeholder="e.g. English, Hindi, Gujarati" value={profileForm.languages}
                  onChange={(e) => setProfileForm((f) => ({ ...f, languages: e.target.value }))}
                  className={inputCls} style={inputStyle} />
              </Field>

              <Field label="Bio / About You">
                <textarea rows={4} placeholder="Tell buyers about yourself and your expertise…" value={profileForm.bio}
                  onChange={(e) => setProfileForm((f) => ({ ...f, bio: e.target.value }))}
                  className={`${inputCls} resize-none`} style={inputStyle} />
              </Field>

              <button type="submit" disabled={profileSaving}
                className="text-white text-sm font-bold py-2.5 rounded-xl mt-1 self-start px-8"
                style={{ background: "linear-gradient(135deg,#3A76DA,#8bace2)", border: "none", cursor: profileSaving ? "wait" : "pointer", opacity: profileSaving ? 0.75 : 1 }}>
                {profileSaving ? "Saving…" : "Save Profile"}
              </button>
            </form>
          </div>
        )}

        {/* ── LEADS ── */}
        {activeTab === "leads" && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden font-Poppins">
            <div className="p-5 border-b border-silver">
              <h2 className="font-bold text-black text-base">Buyer Enquiries</h2>
              <p className="text-ash text-xs mt-0.5">Manage leads from interested buyers</p>
            </div>
            {leadsLoading ? (
              <div className="p-10 text-center text-ash text-sm">Loading leads...</div>
            ) : leads.length === 0 ? (
              <div className="p-10 text-center text-ash text-sm">No enquiries yet. Once buyers contact you, they'll appear here.</div>
            ) : (
              <div className="divide-y divide-silver">
                {leads.map((lead) => {
                  const style = LEAD_STATUS_STYLES[lead.status] || LEAD_STATUS_STYLES.new;
                  return (
                    <div key={lead._id} className="p-4 md:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-ash uppercase font-semibold mb-1">Property</p>
                          <p className="font-semibold text-black text-sm mb-3 truncate">
                            {lead.property?.title || "—"}
                            {lead.property?.city && <span className="text-ash font-normal"> · {lead.property.city}</span>}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-ash">
                            <span className="font-semibold text-black">{lead.senderName}</span>
                            <span className="flex items-center gap-1"><MdPhone className="text-blue" /> {lead.senderPhone}</span>
                            {lead.senderEmail && <span className="flex items-center gap-1"><MdEmail className="text-blue" /> {lead.senderEmail}</span>}
                          </div>
                          {lead.message && <p className="text-ash text-xs mt-2 italic">"{lead.message}"</p>}
                          <p className="text-ash text-xs mt-2">
                            {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
                          <span className="text-xs font-bold px-3 py-1 rounded-full"
                            style={{ backgroundColor: style.bg, color: style.color }}>{style.label}</span>
                          <div className="flex gap-2">
                            {lead.status !== "contacted" && (
                              <button onClick={() => handleStatusChange(lead._id, "contacted")}
                                className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                                style={{ borderColor: "#a16207", color: "#a16207" }}>Mark Contacted</button>
                            )}
                            {lead.status !== "closed" && (
                              <button onClick={() => handleStatusChange(lead._id, "closed")}
                                className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                                style={{ borderColor: "#15803d", color: "#15803d" }}>Close Lead</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BrokerDashboard;
