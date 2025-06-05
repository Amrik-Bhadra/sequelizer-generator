import React, { useEffect } from "react";
import { Outlet, useNavigate, useMatches } from "react-router-dom";
import form_image from "../assets/form_page_img.jpg";
import { FaArrowLeft } from "react-icons/fa6";
import ThemeButton from "../components/common_components/ThemeButton";

const AuthLayout = () => {
  const navigate = useNavigate();
  const matches = useMatches();

  useEffect(() => {
    const currentRoute = matches.find((route) => route?.handle?.title);
    if (currentRoute?.handle?.title) {
      document.title = currentRoute.handle.title;
    }
  }, [matches]);

  return (
    <div className="h-screen w-screen flex">
      <div
        id="image-div"
        className="relative h-full w-0 md:w-[50%] lg:w-[65%] object-cover overflow-hidden"
      >
        <img src={form_image} alt="" className="h-full w-full" />
        <div
          id="overlay"
          className="absolute top-0 left-0 w-full h-full bg-black opacity-10 z-20"
        />
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 flex items-center gap-x-2 right-5 px-6 py-2 text-white rounded-lg bg-white/30 border border-white/30 backdrop-blur-lg shadow-lg hover:bg-white/20 transition cursor-pointer z-40"
        >
          <FaArrowLeft />
          Home
        </button>
      </div>

      <div
        id="form-div"
        className="relative w-full md:w-[50%] lg:w-[35%] flex flex-col justify-center items-center bg-white dark:bg-[#222]"
      >
        {/* Put the ThemeButton at top-right */}
        <div className="absolute top-4 right-5 z-50">
          <ThemeButton />
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
