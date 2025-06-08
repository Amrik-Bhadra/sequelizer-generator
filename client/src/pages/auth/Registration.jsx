import React from 'react'
import { useState } from "react";
import { toast } from "react-hot-toast";
import InputField from "../../components/form_components/InputField";
import PasswordField from "../../components/form_components/PasswordField";
import SolidIconBtn from "../../components/buttons/SolidIconBtn";
import HollowIconButton from "../../components/buttons/HollowIconButton";import { MdEmail } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { HiUserAdd } from "react-icons/hi";
import { MdAppRegistration } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase_config";
import axios from "axios";

const Registration = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if(!username){
        toast.error("Name field not filled!");
        return;
    }

    if(!email){
        toast.error("Email field not filled!");
        return;
    }

    if(!password){
        toast.error("Password field not filled!");
        return;
    }

    try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const response = await axios.post("http://localhost:3000/api/auth/register", {
      uid,
      username,
      email,
      password, 
    });

    if (response.status === 201) {
      toast.success(response.data.message);
      navigate("/auth/login");
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
  };

  const handleGoogleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      const uid = user.uid;
      const username = user.displayName;
      const email = user.email;

      const response = await axios.post("http://localhost:3000/api/auth/google-register", {
        uid,
        username,
        email,
        password: null, // Optional, or handled in backend
      });

      if (response.status === 201) {
        toast.success(response.data.message || "Google registration successful");
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Google registration failed:", error);
      toast.error(error.message);
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
            <HiUserAdd className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Welcome to Sequelizer</h1>
          <p className="text-center text-sm font-light text-secondary-txt">
            Join us and make backend development faster, cleaner, and fun!
          </p>
        </header>
        <form className="flex flex-col gap-5" onSubmit={handleRegister}>
          <InputField
            label="Name"
            type="text"
            name="username"
            id="username"
            placeholder="Enter your Name"
            icon={IoPerson}
            value={username}
            onChange={setName}
            required={true}
          />
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

          <SolidIconBtn
            icon={MdAppRegistration}
            text="Register"
            onClick={ handleRegister }
            className="bg-primary hover:bg-blue-700"
            type="submit"
          />

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-sm text-gray-500 font-medium">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <HollowIconButton
            icon={FcGoogle}
            text="Signup with Google"
            onClick={ handleGoogleRegister }
            className="border-gray-300 hover:bg-gray-100 text-gray-700 mt-2"
          />

          <p className="text-sm text-center text-primary-txt font-light">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-link font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Registration;
