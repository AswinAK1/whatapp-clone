import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { contextContainer } from "../../context/ContextProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setShowLogin }) => {
  const { url, setUserDetails } = useContext(contextContainer);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [currentState, setCurrentState] = useState("Sign up");
  const [otpToken, setOtpToken] = useState(null)
  const [isResendDisabled, setIsResendDisabled] = useState(false);


  const [data, setData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    otp: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (currentState === "Sign up") {
      // Switch to OTP state when "Send OTP" is clicked
      // setCurrentState("OTP");
      try {
      const response = await axios.post(url+"/api/auth/signup", data);
      if (response.data.success) {
        setOtpToken(response.data.otpToken)
        setCurrentState("OTP")
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("An error occurred in sending OTP");
    }
    return;
  };

  if(currentState === 'OTP'){
    try{
      const response = await axios.post(url+"/api/auth/verify-otp",{
        otp:data.otp,
        otpToken
      })
      console.log("Response of the otp:",response);
      

      if(response.data.success){
        alert("Signup successfully....")
        setOtpToken(null)
        setUserDetails(response.data)
        setShowLogin(false)
      }
    }catch(error){
      console.log(error);
      alert("Enter the correct OTP")
    }
  }
  if (currentState === "Login") {
    try {
      const response = await axios.post(url + "/api/auth/login", {
        email: data.email,
        password: data.password,
      });
      console.log("login response:",response);
      

      if (response.data.success) {
        setOtpToken(response.data.token);
        setUserDetails(response.data);
        localStorage.setItem("authToken", response.data.token);
  
        // Also set a cookie manually as fallback
        document.cookie = `jwt=${response.data.token}; path=/; max-age=86400;`;
        console.log("Token saved:", response.data.token);
        console.log("Cookies after login:", document.cookie);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log("Login Error:", error);
      alert("Invalid Email or Password");
    }
  }
};
const handleResendOtp = async () => {
  if (!otpToken) {
    alert('Invalid OTP Token. Please sign up again.');
    return;
  }

  try {
    const response = await axios.post(url+'/api/auth/resent-otp', { otpToken });

    if (response.data.success) {
      setOtpToken(response.data.otpToken);
      alert('OTP has been resent successfully. Please check your email.');
      
      // Disable Resend Button for 30 seconds
      setIsResendDisabled(true);
      setTimeout(() => setIsResendDisabled(false), 30000);
    } else {
      alert(response.data.message || 'Failed to resend OTP.');
    }
  } catch (error) {
    alert(error.response?.data?.message || 'An error occurred while resending OTP.');
  }
};

// console.log("Stored Token:", localStorage.getItem("authToken"));


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative min-h-[400px] min-w-[300px] max-w-sm w-full p-6 rounded-lg shadow-lg bg-white">
        {/* Close Button */}
        <div
          className="absolute top-2 right-6 cursor-pointer text-xl font-bold text-black hover:text-red-600"
          onClick={() => setShowLogin(false)}
        >
          x
        </div>

        {/* Title */}
        <h1 className="text-2xl text-center text-black font-bold">{currentState}</h1>

        <form onSubmit={onSubmitHandler}>
          {/* Signup Fields */}
          {currentState === "Sign up" && (
            <>
              <label className="label p-2">
                <span className="text-black label-text text-sm font-semibold">Full Name</span>
              </label>
              <input
                type="text"
                onChange={onChangeHandler}
                name="fullName"
                value={data.fullName}
                placeholder="Enter Full Name"
                className="w-full input input-bordered border-black bg-transparent placeholder-gray-600 focus:border-black text-black placeholder:text-sm h-9"
              />

              <label className="label p-2">
                <span className="text-black label-text text-sm font-semibold">Phone Number</span>
              </label>
              <input
                type="number"
                onChange={onChangeHandler}
                name="phoneNumber"
                value={data.phoneNumber}
                placeholder="Enter Phone Number"
                className="w-full input input-bordered border-black bg-transparent placeholder-gray-600 focus:border-black text-black placeholder:text-sm h-9 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance:textfield]"
              />

              <label className="label p-2">
                <span className="text-black label-text text-sm font-semibold">Email</span>
              </label>
              <input
                type="email"
                onChange={onChangeHandler}
                name="email"
                value={data.email}
                placeholder="Enter Email"
                className="w-full input input-bordered border-black bg-transparent placeholder-gray-600 focus:border-black text-black placeholder:text-sm h-9"
              />

              <label className="label p-2">
                <span className="text-black label-text text-sm font-semibold">Password</span>
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={onChangeHandler}
                  name="password"
                  value={data.password}
                  placeholder="Enter Password"
                  className="w-full input input-bordered border-black h-9 bg-transparent placeholder-gray-600 focus:border-black text-black placeholder:text-sm"
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </>
          )}

          {/* OTP Input Field */}
          {currentState === "OTP" && (
            <>
              <label className="label p-2 mt-6">
                <span className="text-black label-text text-sm font-semibold">Enter OTP</span>
              </label>
              <input
                type="number"
                onChange={onChangeHandler}
                name="otp"
                value={data.otp}
                placeholder="Enter OTP"
                className="w-full input input-bordered border-black bg-transparent placeholder-gray-600 focus:border-black text-black placeholder:text-sm h-9 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance:textfield]"
              />

              <p className="text-gray-600 text-center mt-4">
                Didn't receive OTP?{" "}
                <span className="text-black cursor-pointer hover:underline" onClick={handleResendOtp}>
                  Resend OTP
                </span>
              </p>
            </>
          )}

          {currentState === 'Login' && (
            <>
              <label className="label p-2">
                <span className="text-black label-text text-sm font-semibold">Email</span>
              </label>
              <input
                type="email"
                onChange={onChangeHandler}
                name="email"
                value={data.email}
                placeholder="Enter Email"
                className="w-full input input-bordered border-black bg-transparent placeholder-gray-600 focus:border-black text-black placeholder:text-sm h-9"
              />

              <label className="label p-2">
                <span className="text-black label-text text-sm font-semibold">Password</span>
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={onChangeHandler}
                  name="password"
                  value={data.password}
                  placeholder="Enter Password"
                  className="w-full input input-bordered border-black h-9 bg-transparent placeholder-gray-600 focus:border-black text-black placeholder:text-sm"
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button className="btn w-full mb-1 mt-8 text-white text-base bg-black hover:bg-gray-700 transition duration-300">
            {currentState === "OTP" ? "Verify OTP" : ""}
            {currentState === 'Login' ? "Login" :""}
            {currentState === 'Sign up' ? "Send OTP" : ""}
          </button>
        </form>

        {/* Switch Between Login & Signup */}
        {currentState === "Login" ? (
          <p className="text-gray-600 text-center mt-4">
            Create a new account?{" "}
            <span className="text-black cursor-pointer hover:underline" onClick={() => setCurrentState("Sign up")}>
              Click here
            </span>
          </p>
        ) : (
          currentState !== "OTP" && (
            <p className="text-gray-600 text-center mt-4">
              Already have an account?{" "}
              <span className="text-black cursor-pointer hover:underline" onClick={() => setCurrentState("Login")}>
                Click here
              </span>
            </p>
          )
        )}

        {/* Back Button for OTP Screen */}
        {currentState === "OTP" && (
          <p className="text-black text-center cursor-pointer hover:underline mt-4" onClick={() => setCurrentState("Sign up")}>
            Go back
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
