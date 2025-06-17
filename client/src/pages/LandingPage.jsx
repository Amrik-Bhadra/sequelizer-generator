import React, { useState } from "react";
import { FaRocket, FaCode, FaDatabase, FaBars, FaTimes } from "react-icons/fa";
import {motion} from "framer-motion"
import SolidIconButton from "../components/buttons/SolidIconBtn";
import { useNavigate } from "react-router-dom";
import hero_bg from "../assets/hero_bg.svg";

const features = [
  {
    icon: <FaCode className="text-3xl text-indigo-600" />,
    title: "Model Code Generator",
    desc: "Generate Sequelize models with just a few clicks, following industry standards.",
  },
  {
    icon: <FaDatabase className="text-3xl text-green-600" />,
    title: "Relationship Mapping",
    desc: "Create single or multiple relationship mappings and download them instantly.",
  },
  {
    icon: <FaRocket className="text-3xl text-pink-600" />,
    title: "One-Click Save & Edit",
    desc: "Save models, duplicate, edit, copy or download in .js format on the go.",
  },
];

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section */}
      <section
        id="hero"
        className="relative flex flex-col justify-center items-center h-screen w-full text-center px-6 bg-center bg-cover"
        style={{ backgroundImage: `url(${hero_bg})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70 z-0"></div>

        {/* Header */}
        <header className="absolute top-0 left-0 w-full px-6 py-4 flex justify-between items-center bg-black/10 backdrop-blur-md z-50">
          <div className="w-[88%] mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-wide">SequelizeGen</h1>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-x-6">
              <button
                onClick={() => scrollTo("about")}
                className="hover:text-indigo-400 transition"
              >
                About
              </button>
              <button
                onClick={() => scrollTo("features")}
                className="hover:text-indigo-400 transition"
              >
                Features
              </button>
              <button
                onClick={() => scrollTo("subscription")}
                className="hover:text-indigo-400 transition"
              >
                Subscription
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="hover:text-indigo-400 transition"
              >
                Contact
              </button>
            </nav>

            <div className="flex items-center gap-x-3">
              <SolidIconButton
                icon={null}
                text="Login"
                onClick={() => navigate("/auth/login")}
                className="text-white text-sm hover:bg-primary"
              />
              <SolidIconButton
                icon={null}
                text="SignUp"
                onClick={() => navigate("/auth/registration")}
                className="bg-white text-secondary text-sm"
              />
              {/* Hamburger (Mobile) */}
              <button
                className="md:hidden z-50 text-xl"
                onClick={() => setIsSidebarOpen(true)}
              >
                <FaBars />
              </button>
            </div>
          </div>
        </header>

        {/* Sidebar (Mobile) */}
        {isSidebarOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 z-[998]"
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div className="fixed top-0 right-0 w-64 h-full bg-gray-900 z-[999] p-6 shadow-lg transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Menu</h2>
                <button onClick={() => setIsSidebarOpen(false)}>
                  <FaTimes className="text-xl" />
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    scrollTo("about");
                    setIsSidebarOpen(false);
                  }}
                  className="hover:text-indigo-400"
                >
                  About
                </button>
                <button
                  onClick={() => {
                    scrollTo("features");
                    setIsSidebarOpen(false);
                  }}
                  className="hover:text-indigo-400"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    scrollTo("subscription");
                    setIsSidebarOpen(false);
                  }}
                  className="hover:text-indigo-400"
                >
                  Subscription
                </button>
                <button
                  onClick={() => {
                    scrollTo("contact");
                    setIsSidebarOpen(false);
                  }}
                  className="hover:text-indigo-400"
                >
                  Contact
                </button>
                <hr className="my-2 border-gray-700" />
                <SolidIconButton
                  icon={null}
                  text="Login"
                  onClick={() => {
                    navigate("/auth/login");
                    setIsSidebarOpen(false);
                  }}
                  className="text-white text-sm hover:bg-primary"
                />
                <SolidIconButton
                  icon={null}
                  text="SignUp"
                  onClick={() => {
                    navigate("/auth/registration");
                    setIsSidebarOpen(false);
                  }}
                  className="bg-white text-secondary text-sm"
                />
              </nav>
            </div>
          </>
        )}

        {/* Main Content */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-semibold leading-tight mt-20 max-w-5xl z-10"
        >
          Generate Sequelize ORM Models & Relationships in Seconds.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-gray-300 mt-6 max-w-3xl z-10"
        >
          Say goodbye to repetitive model coding. Define, save, and map
          Sequelize models effortlessly — all through a clean UI.
        </motion.p>
        <div className="flex gap-x-4 items-center mt-10 z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-6 py-3 bg-primary transition rounded-md text-white font-medium"
            onClick={() => scrollTo("features")}
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-6 py-3 border-2 border-primary transition rounded-md font-medium text-primary"
            onClick={() => scrollTo("features")}
          >
            Get Started
          </motion.button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">
            Why Use Our Generator?
          </h2>
          <div className="grid gap-10 grid-cols-1 md:grid-cols-3">
            {features.map((feat, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">{feat.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                <p className="text-gray-400">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section id="details" className="py-20 bg-black px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Edit & Save with Ease</h2>
            <p className="text-gray-400 mb-4">
              Save your models on the platform, edit anytime, or duplicate an
              existing one for fast reuse. Focus on building apps, not
              boilerplate!
            </p>
            <p className="text-gray-400">
              Download model code directly or copy it to your clipboard in one
              click.
            </p>
          </div>
          <img
            src="/model-code-preview.png"
            alt="Model code preview"
            className="rounded-lg border border-gray-800 shadow-md"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-8 border-t border-gray-800">
        &copy; {new Date().getFullYear()} Sequelizer. Built for developers, by
        developers.
      </footer>
    </div>
  );
};

export default LandingPage;
