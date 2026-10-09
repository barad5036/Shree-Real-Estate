import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import AddPropertyForm from "../../components/Forms/AddPropertyForm";
import Footer from "../../components/Layout/Footer";

const AddPropertyPage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) return <Redirect to="/login" />;

  return (
    <div className="bg-silver min-h-screen pt-20">
      <div className="px-4 md:px-10 lg:px-20 py-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6 font-Poppins text-xs text-ash">
          <Link to="/dashboard/broker" className="hover:text-blue">Broker Dashboard</Link>
          <span>/</span>
          <span className="text-black font-medium">Add Property</span>
        </div>
        <AddPropertyForm />
      </div>
      <Footer />
    </div>
  );
};

export default AddPropertyPage;
