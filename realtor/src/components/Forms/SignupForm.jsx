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
    <>
      <div className="font-Poppins pt-24 md:pt-32 lg:pt-40 flex justify-center lg:justify-between px-4 md:px-16 lg:px-20">
        <div className="bg-white px-4 md:px-7 py-8 w-full lg:w-1/2 rounded-[30px] lg:rounded-[0px] lg:rounded-l-[50px] shadow-md lg:shadow">
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
        <div className="hidden lg:block w-1/2 ml-12 ">
          <div>
            <img
              alt="real estate"
              className="w-full h-[40rem] rounded-r-[50px]"
              src={SignupImage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupForm;
