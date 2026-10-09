import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import SignupImage from "../../assets/Signup.jpg";
import { useSignupMutation } from "../../redux/services/api";
import { login } from "../../redux/features/authSlice";
import { useDispatch } from "react-redux";
// import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

const SignupForm = () => {
  // const [show, setShow] = useState(false);
  // const handleClick = () => setShow(!show);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const roleInputRef = useRef();
  const history = useHistory();
  const [signup] = useSignupMutation();

  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const enteredName = nameInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredRole = roleInputRef.current.value;

    const formData = { name: enteredName, email: enteredEmail, password: enteredPassword, role: enteredRole };

    try {
      const data = await signup(formData).unwrap();
      if (!data.success) throw new Error("Registration failed");
      dispatch(login({ token: data.token, user: data.user }));
      history.replace("/");
    } catch (error) {
      setErrorMessage(error?.data?.message || error.message || "Registration failed");
    }
    setIsLoading(false);
  };

  const content = isLoading ? "Sending Request..." : "Create Account";

  return (
    <div className="font-Poppins pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="px-6 py-10 sm:px-10 lg:px-12 flex flex-col justify-center">
          <div className="flex flex-col items-center pt-5">
            <h2 className="text-xl font-medium mb-4 ">
              Create Your Free Account
            </h2>
            <p className="text-ash mb-12 text-sm">
              Already have an account?{" "}
              <Link to="/login">
                <span className="text-blue">Login</span>
              </Link>
            </p>
          </div>
          {errorMessage && (
            <div className=" text-black mb-10 text-sm p-4 bg-[#f7cfcf] border-[#dc2626] border rounded-lg">
              <p className="text-center text-sm">{errorMessage}</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-5">
              <label className="text-ash text-lg" htmlFor="name">
                Full Name <span className="text-[#dc2626]">*</span>
              </label>
              <input
                className="bg-[#eeecec] border-[#e0dddd] focus:bg-silverLite focus:border-silver border outline-0 h-12 py-2 px-4 rounded-lg"
                id="name"
                type="text"
                ref={nameInputRef}
                required
              />
            </div>
            <div className="flex flex-col mb-5">
              <label className="text-ash text-lg" htmlFor="email">
                Email Address <span className="text-[#dc2626]">*</span>
              </label>
              <input
                className="bg-[#eeecec] border-[#e0dddd] focus:bg-silverLite focus:border-silver border outline-0 h-12 py-2 px-4 rounded-lg"
                id="email"
                type="email"
                ref={emailInputRef}
              />
            </div>
            <div className="flex flex-col mb-5">
              <label className="text-ash text-lg" htmlFor="role">
                Account Type <span className="text-[#dc2626]">*</span>
              </label>
              <select
                className="bg-[#eeecec] border-[#e0dddd] focus:bg-silverLite focus:border-blue hover:border-blue border outline-0 h-12 py-2 px-4 rounded-lg cursor-pointer transition-all"
                id="role"
                ref={roleInputRef}
                defaultValue="buyer"
              >
                <option value="buyer">Buyer</option>
                <option value="broker">Broker</option>
              </select>
            </div>
            <div className="flex flex-col mb-12">
              <label className="text-ash text-lg" htmlFor="password">
                Password <span className="text-[#dc2626]">*</span>
              </label>

              <input
                className="bg-[#eeecec] border-[#e0dddd] focus:bg-silverLite focus:border-silver border outline-0 h-12 py-2 px-4 rounded-lg"
                id="password"
                type="password"
                ref={passwordInputRef}
              />
              {/* <button
                type="button"
                className="text-2xl text-ash relative ml-[17rem] mt-[2.5rem]"
                onClick={handleClick}
              >
                {show ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button> */}
            </div>
            <button className="bg-blue font-medium w-full text-white py-3 rounded-lg">
              {content}
            </button>
          </form>
        </div>
        <div className="relative min-h-[280px] md:min-h-[500px] w-full bg-slate-100 overflow-hidden">
          <img
            alt="Shree Real Estate"
            className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 hover:scale-105"
            src={SignupImage}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
            <span className="text-xs uppercase tracking-widest text-blue-200 font-semibold mb-1">
              Join Shree Real Estate
            </span>
            <h3 className="text-xl sm:text-2xl font-bold mb-1">
              Start Your Real Estate Journey
            </h3>
            <p className="text-xs sm:text-sm text-gray-200">
              Create an account as a Buyer or certified Broker in seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
