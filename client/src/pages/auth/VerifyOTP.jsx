import React, { useEffect, useRef, useState } from "react";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import SolidIconBtn from "../../components/buttons/SolidIconBtn";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { MdVerifiedUser } from "react-icons/md";
import axios from "axios";
import HollowIconButton from "../../components/buttons/HollowIconButton";
import { useAuth } from "../../contexts/AuthContext";


const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(90); 
  const [showResend, setShowResend] = useState(false);
  const intervalRef = useRef(null);
  const location = useLocation();
  const state = location.state;
  const { setUser } = useAuth();

  // Handle OTP input change
  const handleChange = (index, value) => {
    const newOtp = [...otpInputs];
    newOtp[index] = value;
    setOtpInputs(newOtp);
  };

  // Start countdown timer on mount
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime === 1) {
          clearInterval(intervalRef.current);
          setShowResend(true);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  // Format timer as mm:ss
  const formatTime = (timeInSeconds) => {
    const minutes = String(Math.floor(timeInSeconds / 60)).padStart(2, "0");
    const seconds = String(timeInSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleVerifyOtp = async (e) => {
  e.preventDefault();

  const otp = otpInputs.join("");
  if (otp.length !== 5) {
    toast.error("Please enter all 5 digits of the OTP.");
    return;
  }

  try {
    const user_id = state.user_id;
    const purpose = state.purpose;

    const response = await axios.post(
      "http://localhost:3000/api/auth/verifyotp",
      { user_id, otp, purpose },
      { withCredentials: true }
    );

    toast.success(response.data.message);

    if (purpose === "login") {
      const loggedInUser = response.data.user;
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);

      navigate("/seq/dashboard");
    } else {
      navigate("/auth/resetpassword", { state: { user_id } });
    }
  } catch (error) {
    console.error("OTP verification failed:", error);
    toast.error("Invalid OTP. Please try again.");
  }
};

  const handleResendOTP = () => {
    setTimer(90);
    setShowResend(false);

    intervalRef.current = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime === 1) {
          clearInterval(intervalRef.current);
          setShowResend(true);
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  return (
    <>
      <div className="w-full max-w-md bg-white dark:bg-transparent rounded-lg p-6 flex flex-col gap-6">
        <header className="flex flex-col items-center gap-1">
          <div className="h-12 w-12 border border-[#e0e0e0] text-primary-txt rounded-lg flex items-center justify-center mb-5 dark:text-gray-light1">
            <MdOutlineVerifiedUser className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold mb-2 dark:text-white">
            Verify OTP
          </h1>
          <p className="text-sm text-center font-light text-secondary-txt dark:text-gray-light2">
            We have sent a 5 digit verification code to your email
          </p>
        </header>

        <form className="flex flex-col gap-4" onSubmit={handleVerifyOtp}>
          <div className="flex justify-between gap-2">
            {otpInputs.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                className="border border-[#e0e0e0] dark:bg-transparent rounded-md h-16 w-16 text-center text-xl outline-none dark:text-white"
                onInput={(e) => {
                  const input = e.target;
                  const value = input.value.replace(/[^0-9]/g, "");
                  handleChange(index, value);
                  if (value && input.nextElementSibling) {
                    input.nextElementSibling.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    !otpInputs[index] &&
                    e.target.previousElementSibling
                  ) {
                    e.target.previousElementSibling.focus();
                  }
                }}
              />
            ))}
          </div>

          {!showResend && (
            <p className="text-sm text-right text-primary-txt font-regular dark:text-gray-light1">
              {formatTime(timer)}
            </p>
          )}

          <div className="flex flex-col gap-6 w-full">
            <SolidIconBtn
              icon={MdVerifiedUser}
              text="Verify OTP"
              className="bg-primary hover:bg-blue-700"
              type="submit"
            />

            <p className="text-sm text-center text-primary-txt font-light dark:text-gray-light2">
              Didn't receive the OTP?
              {showResend ? (
                <button
                  type="button"
                  className="text-link font-medium ml-2 dark:text-primary"
                  onClick={handleResendOTP}
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-gray-400 ml-2 dark:text-primary">
                  Please wait...
                </span>
              )}
            </p>

            <HollowIconButton
              icon={IoMdArrowBack}
              text="Back to Login"
              onClick={() => navigate("/auth/login")}
              className="border-gray-300 hover:bg-gray-100 text-gray-700"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default VerifyOTP;
