import React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import InputField from "../../components/form_components/InputField";
import PasswordField from "../../components/form_components/PasswordField";
import SolidIconBtn from "../../components/buttons/SolidIconBtn";
import HollowIconButton from "../../components/buttons/HollowIconButton";
import {
  MdEmail,
  IoPerson,
  RiLockPasswordFill,
  HiUserAdd,
  MdAppRegistration,
  FcGoogle,
} from "../../utils/iconsProvider";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase_config";
import axiosInstance from "../../utils/axiosInstance";
import Loader from "../../components/common_components/Loader";

const Registration = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username) {
      toast.error("Name field not filled!");
      return;
    }

    if (!email) {
      toast.error("Email field not filled!");
      return;
    }

    if (!password) {
      toast.error("Password field not filled!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Both passwords should match");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      const response = await axiosInstance.post("/auth/register", {
        uid,
        username,
        email,
        password,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/auth/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
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

      setIsGoogleLoading(true);

      const response = await axiosInstance.post("/auth/google-register", {
        uid,
        username,
        email,
      });

      if (response.status === 200) {
        toast.success(
          response.data.message || "Google registration successful"
        );
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Google registration failed:", error);
      toast.error(error.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-md bg-white dark:bg-transparent rounded-lg p-6 flex flex-col gap-8">
        <header className="flex flex-col items-center gap-1">
          <div className="h-10 w-10 border border-[#e0e0e0] dark:text-gray-light1 text-primary-txt rounded-lg flex items-center justify-center mb-5 ">
            <HiUserAdd className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold dark:text-white mb-2">
            Welcome to Sequelizer
          </h1>
          <p className="text-center text-sm font-light text-secondary-txt dark:text-gray-light2">
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

          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Re-enter your password"
            icon={RiLockPasswordFill}
            value={confirmPassword}
            onChange={setConfirmPassword}
            required={true}
          />

          <div className="flex flex-col gap-y-3 mt-2">
            <SolidIconBtn
              icon={!isLoading ? MdAppRegistration : null}
              text={
                isLoading ? <Loader text={"Registering in..."} /> : "Register"
              }
              onClick={handleRegister}
              className="bg-primary hover:bg-blue-700 text-white"
              type="submit"
            />

            <div className="flex items-center dark:text-gray-light1">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-sm text-gray-500 font-medium dark:text-gray-light1">
                OR
              </span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <HollowIconButton
              icon={!isGoogleLoading ? FcGoogle : null}
              text={
                isGoogleLoading ? (
                  <Loader text={"Registering in..."} />
                ) : (
                  "Signup with Google"
                )
              }
              onClick={handleGoogleRegister}
              className="border-gray-300 hover:bg-gray-100 text-gray-700"
            />
          </div>

          <p className="text-sm text-center text-primary-txt font-light dark:text-gray-light2">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-link font-medium text-primary"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Registration;
