import React from 'react'
import { useState } from "react";
import { toast } from "react-hot-toast";
import InputField from "../../components/form_components/InputField";
import PasswordField from "../../components/form_components/PasswordField";
import SolidIconBtn from "../../components/buttons/SolidIconBtn";
import HollowIconButton from "../../components/buttons/HollowIconButton";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdLogin } from "react-icons/md";
import { FaUserLock } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase_config";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(
        email ? "Email field not filled!" : "Password field not filled"
      );
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password, uid },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success(response?.data.message);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed! Try again.");
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      const uid = user.uid;
      const username = user.displayName;
      const email = user.email;

      // Send to your backend
      const response = await axios.post(
        "http://localhost:3000/api/auth/google-login",
        { uid, username, email },
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast.success(response.data.message || "Google login successful");
        navigate("/dashboard"); 
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full bg-white flex items-center justify-start px-8 mt-2">
        <span>
          {/* <img src={images.logo} alt="logo" className="w-32" /> */}
        </span>
      </div>
      <div className="w-full max-w-md bg-white rounded-lg p-6 flex flex-col gap-8">
        <header className="flex flex-col items-center gap-1">
          <div className="h-10 w-10 border border-[#e0e0e0] text-primary-txt rounded-lg flex items-center justify-center mb-5 ">
            <FaUserLock className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Hi, Welcome Back</h1>
          <p className="text-center text-sm font-light text-secondary-txt">
            Enter your credentials to access your account
          </p>
        </header>
        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
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

          <div className="flex justify-between items-center gap-3">
            {/* Remember Me Checkbox */}
            <label className="flex items-center text-sm text-primary-txt cursor-pointer">
              <input
                type="checkbox"
                className="mr-2 accent-primary-btn cursor-pointer"
                id="rememberMe"
              />
              Remember Me
            </label>

            {/* Forgot Password Link */}
            <div>
              <Link
                to="/auth/forgotpassword"
                className="w-full text-sm text-link font-semibold "
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <SolidIconBtn
            icon={MdLogin}
            text="Login"
            className="bg-primary hover:bg-blue-700"
            type="submit"
          />

          <HollowIconButton
            icon={FcGoogle}
            text="Sign in with Google"
            onClick={ handleGoogleLogin }
            className="border-gray-300 hover:bg-gray-100 text-gray-700 mt-2"
          />

          <p className="text-sm text-center text-primary-txt font-light">
            Don't have an account?{" "}
            <Link
              to="/auth/registration"
              className="text-link font-medium"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
