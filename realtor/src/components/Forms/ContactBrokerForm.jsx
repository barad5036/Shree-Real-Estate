import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useSubmitLeadMutation } from "../../redux/services/api";

const ContactBrokerForm = ({ propertyId, ownerName, contactPhone, propertyTitle }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({ name: user?.name || "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [submitLead, { isLoading }] = useSubmitLeadMutation();

  const handle = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await submitLead({
        propertyId,
        senderName: form.name,
        senderPhone: form.phone,
        senderEmail: user?.email || "",
        message: form.message,
      }).unwrap();
      setSubmitted(true);
    } catch (err) {
      setError(err?.data?.message || "Failed to send enquiry. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-silver rounded-2xl p-6 text-center font-Poppins">
        <p className="text-ash mb-4 text-sm">Please log in to contact the broker.</p>
        <Link to="/login">
          <button className="bg-blue text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-liteBlue transition-colors">
            Login to Contact
          </button>
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 text-center font-Poppins">
        <div className="w-14 h-14 rounded-full bg-blue flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <p className="text-blue font-bold text-base mb-1">Enquiry Sent!</p>
        <p className="text-ash text-sm">{ownerName} will contact you shortly.</p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: user?.name || "", phone: "", message: "" }); }}
          className="mt-4 text-xs text-blue hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 font-Poppins">
      <h3 className="font-bold text-black text-base mb-1">Contact Broker</h3>
      <p className="text-ash text-xs mb-4">
        Enquiring about: <span className="text-blue">{propertyTitle}</span>
      </p>

      <div className="flex items-center gap-3 bg-silver rounded-xl p-3 mb-5">
        <div className="bg-blue text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm flex-shrink-0">
          {ownerName?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-black text-sm">{ownerName}</p>
          <p className="text-ash text-xs">{contactPhone}</p>
        </div>
      </div>

      {error && (
        <p className="text-xs mb-3 p-2 rounded-lg bg-silverLite" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="name"
          value={form.name}
          onChange={handle}
          required
          placeholder="Your Name"
          className="border border-silver rounded-lg p-2.5 text-sm outline-none focus:border-blue font-Poppins"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handle}
          required
          placeholder="Your Phone Number"
          className="border border-silver rounded-lg p-2.5 text-sm outline-none focus:border-blue font-Poppins"
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handle}
          rows={3}
          placeholder="I'm interested in this property..."
          className="border border-silver rounded-lg p-2.5 text-sm outline-none focus:border-blue resize-none font-Poppins"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue text-white font-bold py-2.5 rounded-lg hover:bg-liteBlue transition-colors text-sm disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Send Enquiry"}
        </button>
      </form>
    </div>
  );
};

export default ContactBrokerForm;
