import React, { useEffect } from "react";
import { Outlet, useMatches } from "react-router-dom";
import Header from "../components/common_components/Header";
import Footer from "../components/common_components/Footer";

const UserLayout = () => {
  const matches = useMatches();

  useEffect(() => {
    const currentRoute = matches.find((route) => route?.handle?.title);
    if (currentRoute?.handle?.title) {
      document.title = currentRoute.handle.title;
    }
  }, [matches]);
  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 bg-red-700">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
