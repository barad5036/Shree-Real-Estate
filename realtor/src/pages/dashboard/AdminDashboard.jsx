import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { MdDelete, MdVisibility, MdCheck, MdClose, MdPhone, MdSearch, MdCalendarToday } from "react-icons/md";
import Footer from "../../components/Layout/Footer";
import CustomDropdown from "../../components/UI/CustomDropdown";
import {
  useGetAdminPropertiesQuery,
  useGetAdminStatsQuery,
  useApprovePropertyMutation,
  useRejectPropertyMutation,
  useAdminDeletePropertyMutation,
  useGetAdminUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteAdminUserMutation,
  useGetAdminLeadsQuery,
  useGetAdminBrokersQuery,
  useVerifyBrokerMutation,
  useToggleBlockBrokerMutation,
} from "../../redux/services/api";

const MAIN_TABS = ["properties", "users", "leads", "brokers"];

const AdminDashboard = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const [mainTab, setMainTab] = useState("properties");

  // Properties filters
  const [propStatus, setPropStatus] = useState("");
  const [propCity, setPropCity] = useState("");
  const [propSearch, setPropSearch] = useState("");
  const [propDateFrom, setPropDateFrom] = useState("");
  const [propDateTo, setPropDateTo] = useState("");

  // Users filters
  const [userRole, setUserRole] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [userDateFrom, setUserDateFrom] = useState("");
  const [userDateTo, setUserDateTo] = useState("");

  // Leads filters
  const [leadStatus, setLeadStatus] = useState("");
  const [leadSearch, setLeadSearch] = useState("");
  const [leadDateFrom, setLeadDateFrom] = useState("");
  const [leadDateTo, setLeadDateTo] = useState("");

  // Brokers filters
  const [brokerSearch, setBrokerSearch] = useState("");

  const { data: statsData } = useGetAdminStatsQuery();

  const propParams = { status: propStatus, city: propCity, search: propSearch, dateFrom: propDateFrom, dateTo: propDateTo };
  const { data: propData, isLoading: propLoading } = useGetAdminPropertiesQuery(propParams, { skip: mainTab !== "properties" });

  const userParams = { role: userRole, search: userSearch, dateFrom: userDateFrom, dateTo: userDateTo };
  const { data: usersData, isLoading: usersLoading } = useGetAdminUsersQuery(userParams, { skip: mainTab !== "users" });

  const leadParams = { status: leadStatus, search: leadSearch, dateFrom: leadDateFrom, dateTo: leadDateTo };
  const { data: leadsData, isLoading: leadsLoading } = useGetAdminLeadsQuery(leadParams, { skip: mainTab !== "leads" });

  const brokerParams = { search: brokerSearch };
  const { data: brokersData, isLoading: brokersLoading } = useGetAdminBrokersQuery(brokerParams, { skip: mainTab !== "brokers" });

  const properties = propData?.properties || [];
  const users = usersData?.users || [];
  const leads = leadsData?.leads || [];
  const brokers = brokersData?.brokers || [];
  const stats = statsData?.stats;

  const [approveProperty] = useApprovePropertyMutation();
  const [rejectProperty] = useRejectPropertyMutation();
  const [adminDeleteProperty] = useAdminDeletePropertyMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteAdminUser] = useDeleteAdminUserMutation();
  const [verifyBroker] = useVerifyBrokerMutation();
  const [toggleBlockBroker] = useToggleBlockBrokerMutation();

  if (!isAuthenticated || user?.role !== "admin") return <Redirect to="/login" />;

  const handleDelete = async (id) => {
    if (window.confirm("Delete this property permanently?")) await adminDeleteProperty(id);
  };

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Delete user "${name}"? This cannot be undone.`)) await deleteAdminUser(id);
  };

  const handleRoleChange = async (id, role) => {
    await updateUserRole({ id, role });
  };

  const statusBadge = (status) => {
    const styles = {
      pending: { bg: "#fef9c3", color: "#a16207" },
      approved: { bg: "#dcfce7", color: "#15803d" },
      rejected: { bg: "#fee2e2", color: "#dc2626" },
      new: { bg: "#dbeafe", color: "#1d4ed8" },
      contacted: { bg: "#fef9c3", color: "#a16207" },
      closed: { bg: "#dcfce7", color: "#15803d" },
    };
    const s = styles[status] || { bg: "#f0f3f7", color: "#666565" };
    return (
      <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: s.bg, color: s.color }}>
        {status}
      </span>
    );
  };

  const roleBadge = (role) => {
    const styles = {
      admin: { bg: "#ede9fe", color: "#6d28d9" },
      broker: { bg: "#dbeafe", color: "#1d4ed8" },
      buyer: { bg: "#f0f3f7", color: "#666565" },
    };
    const s = styles[role] || styles.buyer;
    return (
      <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: s.bg, color: s.color }}>
        {role}
      </span>
    );
  };

  // Styled input components
  const SearchInput = ({ value, onChange, placeholder }) => (
    <div className="relative">
      <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-liteBlue text-lg pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full text-sm border-2 border-silver rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-blue focus:ring-2 focus:ring-blue focus:ring-opacity-20 transition-all bg-white font-Poppins placeholder:text-ash hover:border-liteBlue cursor-text"
      />
    </div>
  );

  const DateInput = ({ value, onChange, placeholder }) => (
    <div className="relative">
      <MdCalendarToday className="absolute left-3 top-1/2 -translate-y-1/2 text-liteBlue text-base pointer-events-none" />
      <input
        type="date"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full text-sm border-2 border-silver rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-blue focus:ring-2 focus:ring-blue focus:ring-opacity-20 transition-all bg-white font-Poppins hover:border-liteBlue cursor-pointer"
      />
    </div>
  );

  return (
    <div className="bg-silver min-h-screen pt-20">
      <div className="px-4 md:px-10 lg:px-20 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue to-liteBlue rounded-2xl shadow-lg p-6 mb-6 font-Poppins">
          <h1 className="font-bold text-2xl text-white mb-1">Admin Control Panel</h1>
          <p className="text-white text-sm opacity-90">Production-grade platform management — properties, users, leads, brokers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[
            { label: "Total Properties", value: stats?.totalProperties ?? "—", color: "#3A76DA", icon: "🏠" },
            { label: "Pending Approval", value: stats?.pendingProperties ?? "—", color: "#a16207", icon: "⏳" },
            { label: "Total Users", value: stats?.totalUsers ?? "—", color: "#3A76DA", icon: "👥" },
            { label: "Total Brokers", value: stats?.totalBrokers ?? "—", color: "#1d4ed8", icon: "🤝" },
            { label: "Total Leads", value: stats?.totalLeads ?? "—", color: "#3A76DA", icon: "📊" },
            { label: "Leads This Month", value: stats?.leadsThisMonth ?? "—", color: "#15803d", icon: "📈" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow-md p-5 font-Poppins hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{s.icon}</span>
                <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
              </div>
              <p className="text-ash text-xs font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Main Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setMainTab(tab)}
              className={`text-sm font-bold px-6 py-3 rounded-xl capitalize transition-all font-Poppins shadow-md ${
                mainTab === tab 
                  ? "bg-blue text-white shadow-lg scale-105" 
                  : "bg-white text-ash hover:bg-silverLite hover:text-blue"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* PROPERTIES TAB */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {mainTab === "properties" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden font-Poppins">
            <div className="bg-gradient-to-r from-blue to-liteBlue p-5">
              <h2 className="font-bold text-white text-lg mb-4">🏠 Property Management</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <CustomDropdown
                  dark
                  placeholder="All Status"
                  value={propStatus}
                  onChange={setPropStatus}
                  options={[
                    { value: "",         label: "All Status" },
                    { value: "pending",  label: "⏳ Pending" },
                    { value: "approved", label: "✅ Approved" },
                    { value: "rejected", label: "❌ Rejected" },
                  ]}
                />
                <SearchInput value={propCity} onChange={(e) => setPropCity(e.target.value)} placeholder="Search city..." />
                <SearchInput value={propSearch} onChange={(e) => setPropSearch(e.target.value)} placeholder="Search title..." />
                <DateInput value={propDateFrom} onChange={(e) => setPropDateFrom(e.target.value)} placeholder="From date" />
                <DateInput value={propDateTo} onChange={(e) => setPropDateTo(e.target.value)} placeholder="To date" />
              </div>
            </div>

            {propLoading ? (
              <div className="p-10 text-center text-ash text-sm">Loading properties...</div>
            ) : properties.length === 0 ? (
              <div className="p-10 text-center text-ash text-sm">No properties found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-silverLite">
                    <tr>
                      {["Property", "Broker", "Type", "City", "Price", "Status", "Date", "Actions"].map((h) => (
                        <th key={h} className="text-left text-xs font-bold text-ash uppercase px-4 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((p, i) => (
                      <tr key={p._id} className={`${i % 2 === 0 ? "bg-white" : "bg-silverLite"} hover:bg-silver transition-colors`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt="" className="w-14 h-10 object-cover rounded-lg flex-shrink-0 shadow-sm" />
                            ) : (
                              <div className="w-14 h-10 bg-silver rounded-lg flex-shrink-0" />
                            )}
                            <span className="font-semibold text-black text-xs truncate max-w-[150px]">{p.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-ash text-xs font-medium">{p.owner?.name || "—"}</td>
                        <td className="px-4 py-3 text-ash text-xs">{p.propertyType}</td>
                        <td className="px-4 py-3 text-ash text-xs font-medium">{p.city}</td>
                        <td className="px-4 py-3 font-bold text-blue text-xs">₹{p.price?.toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3">{statusBadge(p.status)}</td>
                        <td className="px-4 py-3 text-ash text-xs">
                          {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link to={`/property/${p._id}`}>
                              <button className="text-blue hover:text-liteBlue transition-colors" title="View">
                                <MdVisibility className="text-xl" />
                              </button>
                            </Link>
                            {p.status === "pending" && (
                              <>
                                <button onClick={() => approveProperty(p._id)} className="text-green-500 hover:text-green-700 transition-colors" title="Approve">
                                  <MdCheck className="text-xl" />
                                </button>
                                <button onClick={() => rejectProperty(p._id)} className="text-yellow-500 hover:text-yellow-700 transition-colors" title="Reject">
                                  <MdClose className="text-xl" />
                                </button>
                              </>
                            )}
                            {p.status === "rejected" && (
                              <button onClick={() => approveProperty(p._id)} className="text-green-500 hover:text-green-700 transition-colors" title="Re-approve">
                                <MdCheck className="text-xl" />
                              </button>
                            )}
                            <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:text-red-600 transition-colors" title="Delete">
                              <MdDelete className="text-xl" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* USERS TAB */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {mainTab === "users" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden font-Poppins">
            <div className="bg-gradient-to-r from-blue to-liteBlue p-5">
              <h2 className="font-bold text-white text-lg mb-4">👥 User Management</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <CustomDropdown
                  dark
                  placeholder="All Roles"
                  value={userRole}
                  onChange={setUserRole}
                  options={[
                    { value: "",       label: "All Roles" },
                    { value: "buyer",  label: "🛒 Buyer" },
                    { value: "broker", label: "🤝 Broker" },
                    { value: "admin",  label: "🛡️ Admin" },
                  ]}
                />
                <SearchInput value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Search name, email, phone..." />
                <DateInput value={userDateFrom} onChange={(e) => setUserDateFrom(e.target.value)} placeholder="From date" />
                <DateInput value={userDateTo} onChange={(e) => setUserDateTo(e.target.value)} placeholder="To date" />
              </div>
            </div>

            {usersLoading ? (
              <div className="p-10 text-center text-ash text-sm">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="p-10 text-center text-ash text-sm">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-silverLite">
                    <tr>
                      {["Name", "Email", "Phone", "Role", "Joined", "Actions"].map((h) => (
                        <th key={h} className="text-left text-xs font-bold text-ash uppercase px-4 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u._id} className={`${i % 2 === 0 ? "bg-white" : "bg-silverLite"} hover:bg-silver transition-colors`}>
                        <td className="px-4 py-3 font-semibold text-black text-xs">{u.name}</td>
                        <td className="px-4 py-3 text-ash text-xs">{u.email}</td>
                        <td className="px-4 py-3 text-ash text-xs">{u.phone || "—"}</td>
                        <td className="px-4 py-3">{roleBadge(u.role)}</td>
                        <td className="px-4 py-3 text-ash text-xs">
                          {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div style={{ minWidth: 120 }}>
                              <CustomDropdown
                                size="sm"
                                value={u.role}
                                onChange={(val) => handleRoleChange(u._id, val)}
                                disabled={u._id === user?._id}
                                options={[
                                  { value: "buyer",  label: "Buyer" },
                                  { value: "broker", label: "Broker" },
                                  { value: "admin",  label: "Admin" },
                                ]}
                              />
                            </div>
                            {u._id !== user?._id && (
                              <button onClick={() => handleDeleteUser(u._id, u.name)} className="text-red-400 hover:text-red-600 transition-colors" title="Delete user">
                                <MdDelete className="text-xl" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* LEADS TAB */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {mainTab === "leads" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden font-Poppins">
            <div className="bg-gradient-to-r from-blue to-liteBlue p-5">
              <h2 className="font-bold text-white text-lg mb-4">📊 Leads Management (Buyer → Broker → Property)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <CustomDropdown
                  dark
                  placeholder="All Status"
                  value={leadStatus}
                  onChange={setLeadStatus}
                  options={[
                    { value: "",          label: "All Status" },
                    { value: "new",       label: "🔵 New" },
                    { value: "contacted", label: "🟡 Contacted" },
                    { value: "closed",    label: "🟢 Closed" },
                  ]}
                />
                <SearchInput value={leadSearch} onChange={(e) => setLeadSearch(e.target.value)} placeholder="Search buyer, broker, property..." />
                <DateInput value={leadDateFrom} onChange={(e) => setLeadDateFrom(e.target.value)} placeholder="From date" />
                <DateInput value={leadDateTo} onChange={(e) => setLeadDateTo(e.target.value)} placeholder="To date" />
              </div>
            </div>

            {leadsLoading ? (
              <div className="p-10 text-center text-ash text-sm">Loading leads...</div>
            ) : leads.length === 0 ? (
              <div className="p-10 text-center text-ash text-sm">No leads found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-silverLite">
                    <tr>
                      {["Buyer", "Contact", "Property", "Broker", "Message", "Status", "Date"].map((h) => (
                        <th key={h} className="text-left text-xs font-bold text-ash uppercase px-4 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, i) => (
                      <tr key={lead._id} className={`${i % 2 === 0 ? "bg-white" : "bg-silverLite"} hover:bg-silver transition-colors`}>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-black text-xs">{lead.buyerName || lead.senderName}</p>
                          <p className="text-ash text-xs">{lead.buyerEmail || lead.senderEmail || "—"}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-xs text-ash font-medium">
                            <MdPhone className="text-blue" />
                            {lead.senderPhone}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-black text-xs truncate max-w-[150px]">{lead.propertyTitle || "—"}</p>
                          <p className="text-ash text-xs">{lead.propertyCity || ""}</p>
                        </td>
                        <td className="px-4 py-3 text-ash text-xs font-medium">{lead.brokerName || "—"}</td>
                        <td className="px-4 py-3 text-ash text-xs italic truncate max-w-[120px]">
                          {lead.message ? `"${lead.message}"` : "—"}
                        </td>
                        <td className="px-4 py-3">{statusBadge(lead.status)}</td>
                        <td className="px-4 py-3 text-ash text-xs">
                          {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* BROKERS TAB */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {mainTab === "brokers" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden font-Poppins">
            <div className="bg-gradient-to-r from-blue to-liteBlue p-5">
              <h2 className="font-bold text-white text-lg mb-4">🤝 Broker Performance Analytics</h2>
              <div className="max-w-md">
                <SearchInput value={brokerSearch} onChange={(e) => setBrokerSearch(e.target.value)} placeholder="Search broker name or email..." />
              </div>
            </div>

            {brokersLoading ? (
              <div className="p-10 text-center text-ash text-sm">Loading brokers...</div>
            ) : brokers.length === 0 ? (
              <div className="p-10 text-center text-ash text-sm">No brokers found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-silverLite">
                    <tr>
                      {["Broker", "Email", "Phone", "Total Listings", "Approved", "Pending", "Total Views", "Total Leads", "New Leads", "Closed Leads", "Joined", "Actions"].map((h) => (
                        <th key={h} className="text-left text-xs font-bold text-ash uppercase px-4 py-4 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {brokers.map((b, i) => (
                      <tr key={b._id} className={`${i % 2 === 0 ? "bg-white" : "bg-silverLite"} hover:bg-silver transition-colors`}>
                        <td className="px-4 py-3 font-semibold text-black text-xs">{b.name}</td>
                        <td className="px-4 py-3 text-ash text-xs">{b.email}</td>
                        <td className="px-4 py-3 text-ash text-xs">{b.phone || "—"}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-bold text-blue text-sm">{b.totalListings}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-bold text-sm" style={{ color: "#15803d" }}>{b.approvedListings}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-bold text-sm" style={{ color: "#a16207" }}>{b.pendingListings}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-bold text-blue text-sm">{b.totalViews}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-bold text-blue text-sm">{b.totalLeads}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-bold text-sm" style={{ color: "#1d4ed8" }}>{b.newLeads}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-bold text-sm" style={{ color: "#15803d" }}>{b.closedLeads}</span>
                        </td>
                        <td className="px-4 py-3 text-ash text-xs">
                          {new Date(b.joinedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => verifyBroker(b.brokerId)}
                              className="text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors"
                              style={{
                                borderColor: b.isVerified ? "#15803d" : "#3A76DA",
                                color: b.isVerified ? "#15803d" : "#3A76DA",
                                background: b.isVerified ? "#dcfce7" : "#dbeafe",
                              }}
                              title={b.isVerified ? "Unverify" : "Verify"}
                            >
                              {b.isVerified ? "✓ Verified" : "Verify"}
                            </button>
                            <button
                              onClick={() => toggleBlockBroker(b.brokerId)}
                              className="text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors"
                              style={{
                                borderColor: b.isBlocked ? "#a16207" : "#dc2626",
                                color: b.isBlocked ? "#a16207" : "#dc2626",
                                background: b.isBlocked ? "#fef9c3" : "#fee2e2",
                              }}
                              title={b.isBlocked ? "Unblock" : "Block"}
                            >
                              {b.isBlocked ? "Unblock" : "Block"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
