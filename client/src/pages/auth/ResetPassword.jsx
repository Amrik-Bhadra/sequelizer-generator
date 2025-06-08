import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordField from "../../components/form_components/PasswordField";
import SolidIconBtn from "../../components/buttons/SolidIconBtn";
import { IoMdArrowBack } from "react-icons/io";
import { MdOutlinePassword } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdLockReset } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e) =>{
    e.preventDefault();
   try{
      if(password !== confirmPassword){
        toast.error("Both Passwords Not Matching!");
        return;
      }

      const response = await axios.put('http://localhost:3000/api/auth/resetpassword', {password});
      if(response.status === 200){
        toast.success(response.data.message);
        navigate('/auth/login');
      }else{
        toast.error(response.data.message);
      }
   }catch(error){
    toast.error(error);
   }
  }
  
  return (
    <>
      <div className="absolute top-0 left-0 w-full bg-white flex items-center justify-between px-8 mt-2">
        {/* <span>
          <img src={images.logo} alt="logo" className="w-32" />
        </span>
        <a href="/auth/login" className="text-link underline font-medium">
          Create Account
        </a> */}
      </div>
      <div className="w-full max-w-md bg-white rounded-lg p-6 flex flex-col gap-6">
        <header className="flex flex-col items-center gap-1">
          <div className="h-12 w-12 border border-[#e0e0e0] text-primary-txt rounded-lg flex items-center justify-center mb-5 ">
            <MdOutlinePassword className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Set New Password</h1>
          <p className="text-sm text-center font-light text-secondary-txt">
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
              className="bg-primary hover:bg-blue-700"
              onClick={handleResetPassword}
            />

            <button
              className="border hover:bg-[#f5f5f5] text-primary-txt px-4 py-2 rounded-md flex gap-2 items-center justify-center"
              onClick={() => navigate("/auth/login")}
            >
              <IoMdArrowBack className="h-5 w-5" />
              <span className="text-sm font-medium font-body">
                Back to Login
              </span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
