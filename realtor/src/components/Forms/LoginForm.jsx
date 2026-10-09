import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import LoginImage from "../../assets/Signup.jpg";
import { useLogInMutation } from "../../redux/services/api";
import { login } from "../../redux/features/authSlice";
import { useDispatch } from "react-redux";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const history = useHistory();
  const [logIn] = useLogInMutation();

  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    const formData = { email: enteredEmail, password: enteredPassword };

    try {
      const data = await logIn(formData).unwrap();
      if (!data.success) throw new Error("Login failed");
      dispatch(login({ token: data.token, user: data.user }));
      history.replace("/");
    } catch (error) {
      setErrorMessage(error?.data?.message || error.message || "Login failed");
    }
    setIsLoading(false);
  };

  const content = isLoading ? "Logging in..." : "Log in";

  return (
    <>
      <div className="font-Poppins pt-24 md:pt-32 lg:pt-40 flex justify-center lg:justify-between px-4 md:px-16 lg:px-20">
        <div className="bg-white px-4 md:px-7 py-8 w-full lg:w-1/2 rounded-[30px] lg:rounded-[0px] lg:rounded-l-[50px] shadow-md lg:shadow">
          <div className="flex flex-col items-center pt-5">
            <h2 className="text-2xl font-medium mb-3 ">Log in to Shree Real Estate</h2>
            <p className="text-ash mb-10 text-sm">
              Don't have an account yet?
              <Link to="/signup">
                <span className="text-blue"> Create one for free</span>
              </Link>
            </p>
          </div>
          {errorMessage && (
            <div className="text-black mb-8 text-sm p-4 bg-[#f7cfcf] border-[#dc2626] border rounded-lg">
              {" "}
              <p className="text-center text-sm">{errorMessage}</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-5">
              <label className="text-ash pb-2 text-lg" htmlFor="email">
                Email <span className="text-[#dc2626]">*</span>
              </label>
              <input
                className="bg-[#eeecec] border-[#e0dddd] focus:bg-silverLite focus:border-silver border outline-0 h-12 py-2 px-4 rounded-lg"
                id="email"
                type="email"
                ref={emailInputRef}
              />
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
              src={LoginImage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
