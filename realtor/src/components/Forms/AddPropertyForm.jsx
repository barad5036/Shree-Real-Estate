import React, { useState, useRef } from "react";
import { PROPERTY_TYPES, LISTING_TYPES } from "../../data/mockProperties";
import { useSelector } from "react-redux";
import { MdAddPhotoAlternate, MdClose, MdHome, MdLocationOn, MdPhone, MdDescription } from "react-icons/md";
import { FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import LocationPicker from "../property/LocationPicker";
import CustomDropdown from "../UI/CustomDropdown";

const INITIAL = {
  title: "",
  description: "",
  price: "",
  propertyType: PROPERTY_TYPES.APARTMENT,
  listingType: LISTING_TYPES.SALE,
  bedrooms: "",
  bathrooms: "",
  area: "",
  city: "",
  address: "",
  contactPhone: "",
  dailyPrice: "",
  indoorOutdoor: "Indoor",
  parkingAvailable: false,
  latitude: null,
  longitude: null,
};

const LISTING_OPTIONS = [
  { value: LISTING_TYPES.SALE, label: "For Sale", desc: "Sell your property", icon: "🏷️" },
  { value: LISTING_TYPES.RENT, label: "For Rent", desc: "Rent it out monthly", icon: "🔑" },
  { value: "shooting", label: "Shooting Location", desc: "Rent for film & shoots", icon: "🎬" },
];

const PROPERTY_TYPE_OPTIONS = [
  { value: PROPERTY_TYPES.HOUSE, label: "House", icon: "🏠" },
  { value: PROPERTY_TYPES.APARTMENT, label: "Apartment", icon: "🏢" },
  { value: PROPERTY_TYPES.LAND, label: "Land / Plot", icon: "🌿" },
  { value: PROPERTY_TYPES.SHOP, label: "Shop", icon: "🏪" },
  { value: PROPERTY_TYPES.WAREHOUSE, label: "Warehouse", icon: "🏭" },
  { value: PROPERTY_TYPES.SHOOTING_LOCATION, label: "Shooting Location", icon: "🎬" },
];

const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-9 h-9 rounded-xl bg-blue flex items-center justify-center text-white text-lg flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="font-bold text-black text-sm font-Poppins">{title}</p>
      {subtitle && <p className="text-ash text-xs font-Poppins">{subtitle}</p>}
    </div>
  </div>
);

const AddPropertyForm = () => {
  const [form, setForm] = useState(INITIAL);
  const [listingMode, setListingMode] = useState("sale"); // sale | rent | shooting
  const [images, setImages] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();
  const token = useSelector((state) => state.auth.token);

  const isShootingMode = listingMode === "shooting";

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleListingMode = (mode) => {
    setListingMode(mode);
    if (mode === "shooting") {
      setForm((prev) => ({
        ...prev,
        listingType: LISTING_TYPES.RENT,
        propertyType: PROPERTY_TYPES.SHOOTING_LOCATION,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        listingType: mode,
        propertyType: prev.propertyType === PROPERTY_TYPES.SHOOTING_LOCATION
          ? PROPERTY_TYPES.APARTMENT
          : prev.propertyType,
      }));
    }
  };

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...newImages].slice(0, 10));
    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== "" && form[key] !== null) formData.append(key, form[key]);
      });
      images.forEach(({ file }) => formData.append("images", file));

      const apiBase = process.env.REACT_APP_API_URL || "/api";
      const res = await fetch(`${apiBase}/properties`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setForm(INITIAL);
        setImages([]);
        setListingMode("sale");
      } else {
        throw new Error(data.message || "Failed to create property");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center font-Poppins max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-blue flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="font-bold text-black text-2xl mb-2">Property Submitted!</h2>
          <p className="text-ash text-sm mb-8 leading-relaxed">
            Your property has been submitted for admin review.<br />
            It will be visible to buyers once approved.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-blue text-white px-10 py-3 rounded-xl text-sm font-bold hover:bg-liteBlue transition-colors"
          >
            + Add Another Property
          </button>
        </div>
      </div>
    );
  }

  const inputCls = "border border-silver rounded-xl px-4 py-3 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 hover:border-blue w-full font-Poppins bg-white transition-all";
  const labelCls = "text-xs font-bold text-ash uppercase tracking-wide mb-1.5 block font-Poppins";

  return (
    <div className="font-Poppins">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-bold text-2xl text-black mb-1">List Your Property</h1>
        <p className="text-ash text-sm">Fill in the details below to list your property on Shree Real Estate.</p>
      </div>

      {error && (
        <div className="bg-white border-l-4 rounded-xl p-4 mb-6 text-sm flex items-center gap-3" style={{ borderColor: "#dc2626", color: "#dc2626" }}>
          <span className="text-lg">⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── SECTION 1: Listing Type ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-silver p-6">
          <SectionHeader icon={<HiOutlineOfficeBuilding />} title="Listing Type" subtitle="What are you looking to do with this property?" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {LISTING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleListingMode(opt.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  listingMode === opt.value
                    ? "border-blue bg-blue text-white shadow-md"
                    : "border-silver bg-silverLite text-ash hover:border-blue"
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <span className="font-bold text-sm">{opt.label}</span>
                <span className={`text-xs ${listingMode === opt.value ? "text-white opacity-80" : "text-ash"}`}>{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── SECTION 2: Property Type (hidden for shooting mode) ── */}
        {!isShootingMode && (
          <div className="bg-white rounded-2xl shadow-sm border border-silver p-6">
            <SectionHeader icon={<MdHome />} title="Property Type" subtitle="Select the category that best describes your property" />
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {PROPERTY_TYPE_OPTIONS.filter(o => o.value !== PROPERTY_TYPES.SHOOTING_LOCATION).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, propertyType: opt.value }))}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    form.propertyType === opt.value
                      ? "border-blue bg-blue text-white shadow-md"
                      : "border-silver bg-silverLite text-ash hover:border-blue"
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-xs font-semibold text-center leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── SECTION 3: Basic Details ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-silver p-6">
          <SectionHeader icon={<MdDescription />} title="Property Details" subtitle="Provide the basic information about your property" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelCls}>Property Title *</label>
              <input name="title" value={form.title} onChange={handle} required placeholder="e.g. Spacious 3BHK Apartment with Sea View" className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>{isShootingMode ? "Daily Price (₹) *" : "Price (₹) *"}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ash font-bold text-sm">₹</span>
                <input
                  name={isShootingMode ? "dailyPrice" : "price"}
                  type="number"
                  value={isShootingMode ? form.dailyPrice : form.price}
                  onChange={handle}
                  required
                  placeholder={isShootingMode ? "e.g. 50000" : "e.g. 5000000"}
                  className={`${inputCls} pl-8`}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Area (sqft) *</label>
              <div className="relative">
                <FaRulerCombined className="absolute left-3 top-1/2 -translate-y-1/2 text-ash text-sm" />
                <input name="area" type="number" value={form.area} onChange={handle} required placeholder="e.g. 1200" className={`${inputCls} pl-8`} />
              </div>
            </div>

            {!isShootingMode && (
              <>
                <div>
                  <label className={labelCls}>Bedrooms</label>
                  <div className="relative">
                    <FaBed className="absolute left-3 top-1/2 -translate-y-1/2 text-ash text-sm" />
                    <input name="bedrooms" type="number" value={form.bedrooms} onChange={handle} placeholder="e.g. 3" className={`${inputCls} pl-8`} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Bathrooms</label>
                  <div className="relative">
                    <FaBath className="absolute left-3 top-1/2 -translate-y-1/2 text-ash text-sm" />
                    <input name="bathrooms" type="number" value={form.bathrooms} onChange={handle} placeholder="e.g. 2" className={`${inputCls} pl-8`} />
                  </div>
                </div>
              </>
            )}

            {isShootingMode && (
              <>
                <div>
                  <label className={labelCls}>Indoor / Outdoor</label>
                  <CustomDropdown
                    value={form.indoorOutdoor}
                    onChange={(val) => setForm((prev) => ({ ...prev, indoorOutdoor: val }))}
                    options={[
                      { value: "Indoor",  label: "Indoor" },
                      { value: "Outdoor", label: "Outdoor" },
                      { value: "Both",    label: "Both" },
                    ]}
                  />
                </div>
                <div className="flex items-center gap-3 p-4 border border-silver rounded-xl bg-silverLite">
                  <input type="checkbox" name="parkingAvailable" id="parking" checked={form.parkingAvailable} onChange={handle} className="w-4 h-4 accent-blue" />
                  <label htmlFor="parking" className="text-sm font-medium text-black cursor-pointer">Parking Available on Site</label>
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className={labelCls}>Description *</label>
              <textarea name="description" value={form.description} onChange={handle} required rows={4} placeholder="Describe the property — highlights, nearby landmarks, amenities..." className={`${inputCls} resize-none`} />
            </div>
          </div>
        </div>

        {/* ── SECTION 4: Location ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-silver p-6">
          <SectionHeader icon={<MdLocationOn />} title="Location" subtitle="Where is the property located?" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>City *</label>
              <input name="city" value={form.city} onChange={handle} required placeholder="e.g. Pune" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Contact Phone *</label>
              <div className="relative">
                <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-ash text-base" />
                <input name="contactPhone" value={form.contactPhone} onChange={handle} required placeholder="+91 98765 43210" className={`${inputCls} pl-8`} />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Full Address *</label>
              <div className="relative">
                <MdLocationOn className="absolute left-3 top-3.5 text-ash text-base" />
                <input name="address" value={form.address} onChange={handle} required placeholder="Street, Area, City, State PIN" className={`${inputCls} pl-8`} />
              </div>
            </div>
            <LocationPicker
              address={form.address || form.city}
              latitude={form.latitude}
              longitude={form.longitude}
              onChange={({ latitude, longitude }) =>
                setForm((prev) => ({ ...prev, latitude, longitude }))
              }
            />
          </div>
        </div>

        {/* ── SECTION 5: Images ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-silver p-6">
          <SectionHeader
            icon={<MdAddPhotoAlternate />}
            title="Property Photos"
            subtitle={`Upload up to 10 photos · ${images.length}/10 added`}
          />

          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageAdd} className="hidden" />

          {images.length === 0 ? (
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="w-full border-2 border-dashed border-silver rounded-2xl py-14 flex flex-col items-center gap-3 text-ash hover:border-blue hover:text-blue transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-silver group-hover:bg-blue group-hover:text-white flex items-center justify-center transition-all">
                <MdAddPhotoAlternate className="text-3xl" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm">Click to upload photos</p>
                <p className="text-xs mt-0.5">JPG, PNG · Max 5MB each · Up to 10 images</p>
              </div>
            </button>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {images.map((img, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden border border-silver aspect-square">
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-blue text-white text-xs text-center py-1 font-bold">
                      Cover Photo
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-black bg-opacity-70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-100"
                  >
                    <MdClose className="text-xs" />
                  </button>
                </div>
              ))}
              {images.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-silver flex flex-col items-center justify-center text-ash hover:border-blue hover:text-blue transition-all gap-1"
                >
                  <MdAddPhotoAlternate className="text-2xl" />
                  <span className="text-xs font-medium">Add More</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue text-white font-bold py-4 rounded-2xl hover:bg-liteBlue transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Submitting...
            </>
          ) : (
            "Submit Property for Review →"
          )}
        </button>

      </form>
    </div>
  );
};

export default AddPropertyForm;













