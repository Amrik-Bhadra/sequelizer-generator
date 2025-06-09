import React, { useEffect } from "react";
import { Outlet, useMatches } from "react-router-dom";
import Header from "../components/common_components/Header";
import Footer from "../components/common_components/Footer";
import { useAuth } from "../contexts/AuthContext";
import CodeModal from "../components/modals/CodeModal";

const UserLayout = () => {
  const { user, logout } = useAuth();
  const matches = useMatches();

  useEffect(() => {
    const currentRoute = matches.find((route) => route?.handle?.title);
    if (currentRoute?.handle?.title) {
      document.title = currentRoute.handle.title;
    }
  }, [matches]);
  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg">
      <Header email={user?.email} name={user?.username} logout={logout} />
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
      <Footer />

      {/* <CodeModal/> */}
    </div>
  );
};

export default UserLayout;
