import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap");

          * {
            font-family: "Poppins", sans-serif;
          }

          @keyframes rotate {
            100% {
              transform: rotate(1turn);
            }
          }

          .rainbow::before {
            content: '';
            position: absolute;
            z-index: -2;
            left: -50%;
            top: -50%;
            width: 200%;
            height: 200%;
            background-position: 100% 50%;
            background-repeat: no-repeat;
            background-size: 50% 30%;
            filter: blur(6px);
            background-image: linear-gradient(#FFF);
            animation: rotate 4s linear infinite;
          }
        `}
      </style>

      <nav className="fixed top-0 left-0 w-full z-50 flex flex-col items-center bg-black/10 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-4 w-full">

          {/* Logo */}
          <Link to={'/'}>
            <img src={assets.logo} alt="logo" className="h-5 sm:h-7" />
          </Link>

          {/* Menu */}
          <div
            className={`${mobileOpen ? "max-md:w-full" : "max-md:w-0"
              } max-md:fixed max-md:top-0 max-md:z-10 max-md:left-0
  max-md:transition-all max-md:duration-300
  max-md:overflow-hidden max-md:h-screen
  max-md:bg-black/80 max-md:backdrop-blur
  max-md:flex-col max-md:justify-center
  flex items-center gap-8 text-sm text-white`}
          >
            <Link to={'/'} className="hover:text-[#A6FF5D] transition-colors">Home</Link>
            <Link to={'/projects'} className="hover:text-[#A6FF5D] transition-colors">My Projects</Link>
            <Link to={'/community'} className="hover:text-[#A6FF5D] transition-colors">Community</Link>
            <Link to={'/pricing'} className="hover:text-[#A6FF5D] transition-colors">Pricing</Link>

            {/* Close Button (Mobile Only) */}
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-md"
            >
              ✕
            </button>

            {/* Desktop Button */}
            <button onClick={() => navigate('/auth/signin')} className="bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-800 px-6 py-2.5 rounded-full text-sm transition cursor-pointer group">
              <div className="relative overflow-hidden">
                <span className="block transition-transform duration-200 group-hover:-translate-y-full">
                  Get Started
                </span>
                <span className="absolute top-0 left-0 block transition-transform duration-200 group-hover:translate-y-0 translate-y-full">
                  Get Started
                </span>
              </div>
            </button>
          </div>

          {/* Open Button (Mobile Only) */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-md"
          >
            ☰
          </button>

        </div>
      </nav>
    </>
  );
};

export default Navbar;
