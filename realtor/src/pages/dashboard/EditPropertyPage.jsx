import React, { useState, useEffect } from "react";
import { useParams, useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { PROPERTY_TYPES, LISTING_TYPES } from "../../data/mockProperties";
import { useGetPropertyByIdQuery } from "../../redux/services/api";
import Loader from "../../components/UI/Loader";
import Footer from "../../components/Layout/Footer";
import LocationPicker from "../../components/property/LocationPicker";
import CustomDropdown from "../../components/UI/CustomDropdown";

const EditPropertyPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const { data, isLoading } = useGetPropertyByIdQuery(id);

  const [form, setForm] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill form once property loads
  useEffect(() => {
    if (data?.property) {
      const p = data.property;
      setForm({
        title: p.title || "",
        description: p.description || "",
        price: p.price || "",
        propertyType: p.propertyType || PROPERTY_TYPES.APARTMENT,
        listingType: p.listingType || LISTING_TYPES.SALE,
        bedrooms: p.bedrooms || "",
        bathrooms: p.bathrooms || "",
        area: p.area || "",
        city: p.city || "",
        address: p.address || "",
        contactPhone: p.contactPhone || "",
        dailyPrice: p.dailyPrice || "",
        indoorOutdoor: p.indoorOutdoor || "Indoor",
        parkingAvailable: p.parkingAvailable || false,
        latitude: p.latitude || null,
        longitude: p.longitude || null,
      });
    }
  }, [data]);

  if (!isAuthenticated || (user?.role !== "broker" && user?.role !== "admin")) {
    return <Redirect to="/login" />;
  }

  if (isLoading || !form) return <Loader />;

  const isShootingLocation = form.propertyType === PROPERTY_TYPES.SHOOTING_LOCATION;

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== "" && form[key] !== null) formData.append(key, form[key]);
      });
      newImages.forEach((img) => formData.append("images", img));

      const apiBase = process.env.REACT_APP_API_URL || "/api";
      const res = await fetch(`${apiBase}/properties/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => history.push("/dashboard/broker/my-properties"), 1500);
      } else {
        throw new Error(data.message || "Update failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "border border-silver rounded-lg p-2.5 text-sm outline-none focus:border-blue hover:border-blue w-full font-Poppins transition-all";
  const labelCls = "text-xs font-semibold text-ash uppercase mb-1 block font-Poppins";

  return (
    <div className="bg-silver min-h-screen pt-20">
      <div className="px-4 md:px-10 lg:px-20 py-8 max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 font-Poppins flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-bold text-xl text-black mb-1">Edit Property</h1>
            <p className="text-ash text-sm">Update your property details. It will go back to pending review after saving.</p>
          </div>
          <button
            onClick={() => history.goBack()}
            className="text-ash text-sm hover:text-blue transition-colors self-start sm:self-auto"
          >
            ← Back
          </button>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 font-Poppins text-sm text-center">
            ✓ Property updated successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 font-Poppins text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 font-Poppins">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

            <div className="md:col-span-2">
              <label className={labelCls}>Title *</label>
              <input name="title" value={form.title} onChange={handle} required className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Property Type *</label>
              <CustomDropdown
                value={form.propertyType}
                onChange={(val) => setForm((p) => ({ ...p, propertyType: val }))}
                options={Object.values(PROPERTY_TYPES).map((t) => ({ value: t, label: t }))}
              />
            </div>

            <div>
              <label className={labelCls}>Listing Type *</label>
              <CustomDropdown
                value={form.listingType}
                onChange={(val) => setForm((p) => ({ ...p, listingType: val }))}
                options={[
                  { value: LISTING_TYPES.SALE, label: "For Sale" },
                  { value: LISTING_TYPES.RENT, label: "For Rent" },
                ]}
              />
            </div>

            <div>
              <label className={labelCls}>Price (₹) *</label>
              <input name="price" type="number" value={form.price} onChange={handle} required className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Area (sqft) *</label>
              <input name="area" type="number" value={form.area} onChange={handle} required className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Bedrooms</label>
              <input name="bedrooms" type="number" value={form.bedrooms} onChange={handle} className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Bathrooms</label>
              <input name="bathrooms" type="number" value={form.bathrooms} onChange={handle} className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>City *</label>
              <input name="city" value={form.city} onChange={handle} required className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Contact Phone *</label>
              <input name="contactPhone" value={form.contactPhone} onChange={handle} required className={inputCls} />
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>Full Address *</label>
              <input name="address" value={form.address} onChange={handle} required className={inputCls} />
            </div>

            <div className="md:col-span-2">
              <LocationPicker
                address={form.address || form.city}
                latitude={form.latitude}
                longitude={form.longitude}
                onChange={({ latitude, longitude }) =>
                  setForm((prev) => ({ ...prev, latitude, longitude }))
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>Description *</label>
              <textarea name="description" value={form.description} onChange={handle} required rows={4} className={`${inputCls} resize-none`} />
            </div>

            {/* New images */}
            <div className="md:col-span-2 border-t border-silver pt-4">
              <p className="text-xs font-bold text-blue uppercase mb-3">Add New Images (optional)</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setNewImages(Array.from(e.target.files))}
                className={inputCls}
              />
              <p className="text-xs text-ash mt-1">Existing images will be kept. New images will be added.</p>
            </div>

            {/* Existing images preview */}
            {data?.property?.images?.length > 0 && (
              <div className="md:col-span-2">
                <label className={labelCls}>Current Images</label>
                <div className="flex flex-wrap gap-3 mt-1">
                  {data.property.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-24 h-16 object-cover rounded-lg border border-silver" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Shooting location extras */}
          {isShootingLocation && (
            <div className="border-t border-silver pt-4 mt-2 mb-4">
              <p className="text-xs font-bold text-blue uppercase mb-3">Shooting Location Details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Daily Price (₹)</label>
                  <input name="dailyPrice" type="number" value={form.dailyPrice} onChange={handle} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Indoor / Outdoor</label>
                  <CustomDropdown
                    value={form.indoorOutdoor}
                    onChange={(val) => setForm((p) => ({ ...p, indoorOutdoor: val }))}
                    options={[
                      { value: "Indoor",  label: "Indoor" },
                      { value: "Outdoor", label: "Outdoor" },
                      { value: "Both",    label: "Both" },
                    ]}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="parkingAvailable" id="parking" checked={form.parkingAvailable} onChange={handle} className="accent-blue w-4 h-4" />
                  <label htmlFor="parking" className="text-sm text-ash cursor-pointer">Parking Available</label>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue text-white font-bold py-3 rounded-lg hover:bg-liteBlue transition-colors text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed font-Poppins"
          >
            {isSubmitting ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EditPropertyPage;
