import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PasswordField from "../../components/form_components/PasswordField";
import SolidIconBtn from "../../components/buttons/SolidIconBtn";
import { IoMdArrowBack } from "react-icons/io";
import { MdOutlinePassword } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdLockReset } from "react-icons/md";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import HollowIconButton from "../../components/buttons/HollowIconButton";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();
  const state = location.state;

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        toast.error("Both Passwords Not Matching!");
        return;
      }

      const user_id = state.user_id;
      const response = await axiosInstance.put("/auth/resetpassword", {
        user_id,
        password,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/auth/login");
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
            <MdOutlinePassword className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold mb-2 dark:text-white">
            Set New Password
          </h1>
          <p className="text-sm text-center font-light text-secondary-txt dark:text-gray-light2">
            Must be at least 8 characters.
          </p>
        </header>
        <form className="flex flex-col gap-8">
          <PasswordField
            label="Password"
            name="password"
            id="password"
            placeholder="Enter your password"
            icon={RiLockPasswordFill}
            value={password}
            onChange={setPassword}
            required={true}
          />

          <PasswordField
            label="ConfirmPassword"
            name="confirmpassword"
            id="confirmpassword"
            placeholder="Re-enter your password"
            icon={RiLockPasswordFill}
            value={confirmPassword}
            onChange={setConfirmPassword}
            required={true}
          />

          <div className="flex flex-col gap-3 w-full">
            <SolidIconBtn
              icon={MdLockReset}
              text="Reset Password"
              className="bg-primary hover:bg-blue-700 text-white"
              onClick={handleResetPassword}
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

export default ResetPassword;
