import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/form_components/InputField";
import SolidIconBtn from "../../components/buttons/SolidIconBtn";
import { MdEmail } from "react-icons/md";
import { IoFingerPrintSharp } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";
import { MdLockOpen } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";
import HollowIconButton from "../../components/buttons/HollowIconButton";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/forgotpassword",
        {
          email,
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/auth/verifyotp", {
          state: { user_id: response.data.user_id, purpose: "forgot_password" },
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <div className="w-full max-w-md bg-white dark:bg-transparent rounded-lg p-6 flex flex-col gap-6">
        <header className="flex flex-col items-center gap-1">
          <div className="h-12 w-12 border border-[#e0e0e0] dark:text-gray-light1 text-primary-txt rounded-lg flex items-center justify-center mb-5 ">
            <IoFingerPrintSharp className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold mb-2 dark:text-white">
            Forget Password?
          </h1>
          <p className="text-sm text-center font-light text-secondary-txt dark:text-gray-light2">
            Enter the email address associated with your account and we will
            send you a verification code to reset your password.
          </p>
        </header>
        <form className="flex flex-col gap-8">
          <InputField
            label="Email"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            icon={MdEmail}
            value={email}
            onChange={setEmail}
            required={true}
          />

          <div className="flex flex-col gap-3 w-full">
            <SolidIconBtn
              icon={MdLockOpen}
              text="Send OTP"
              className="bg-primary hover:bg-blue-700"
              onClick={handleSendOTP}
            />

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

export default ForgotPassword;
