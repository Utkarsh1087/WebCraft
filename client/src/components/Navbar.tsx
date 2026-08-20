import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import {UserButton} from "@daveyplate/better-auth-ui"
import api from "@/configs/axios";
import { toast } from "sonner";
import { useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
const [credits, setCredits] = useState(0)

  const {data: session} = authClient.useSession()

const getCredits = async () =>{
  try {
    const {data} = await api.get('/api/user/credits')
    setCredits(data.credits)
  } catch (error:any) {
    toast.error(error.response.data.message)
    console.log(error)
  }
}


useEffect(() => {
 if(session?.user){
  getCredits()
 }
}, [session?.user])

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

      <nav className="fixed top-0 left-0 w-full z-[60] flex flex-col items-center bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-4 w-full relative">

          {/* Logo */}
          <Link to={'/'}>
            <img src={assets.webcraft} alt="logo" className="h-5 md:h-5" />
          </Link>

          {/* Mobile Menu Overlay */}
          <div
            className={`fixed inset-0 z-[70] transition-all duration-300 ease-in-out md:hidden flex flex-col items-center justify-center gap-8 bg-black/95 backdrop-blur-2xl ${
              mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-6 right-6 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={28} />
            </button>

            <Link to={'/'} onClick={() => setMobileOpen(false)} className="text-2xl font-medium hover:text-[#A6FF5D] transition-colors">Home</Link>
            <Link to={'/projects'} onClick={() => setMobileOpen(false)} className="text-2xl font-medium hover:text-[#A6FF5D] transition-colors">My Projects</Link>
            <Link to={'/community'} onClick={() => setMobileOpen(false)} className="text-2xl font-medium hover:text-[#A6FF5D] transition-colors">Community</Link>
            <Link to={'/pricing'} onClick={() => setMobileOpen(false)} className="text-2xl font-medium hover:text-[#A6FF5D] transition-colors">Pricing</Link>

            {!session?.user ? (
              <button 
                onClick={() => { setMobileOpen(false); navigate('/auth/signin'); }} 
                className="mt-4 bg-[#A6FF5D] text-gray-900 px-8 py-3 rounded-full text-lg font-bold"
              >
                Get Started
              </button>
            ) : (
                <div className="flex flex-col items-center gap-4 mt-4">
                  <button className="flex items-center gap-2 text-xl" onClick={() => { setMobileOpen(false); navigate('/pricing'); }}>
                    Credits: <span className="text-[#A6FF5D]">{credits}</span>
                  </button>
                  <UserButton size="lg"/>
                </div>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm text-white">
            <Link to={'/'} className="hover:text-[#A6FF5D] transition-colors">Home</Link>
            <Link to={'/projects'} className="hover:text-[#A6FF5D] transition-colors">My Projects</Link>
            <Link to={'/community'} className="hover:text-[#A6FF5D] transition-colors">Community</Link>
            <Link to={'/pricing'} className="hover:text-[#A6FF5D] transition-colors">Pricing</Link>

            {!session?.user ?(
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
            ) : (
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2" onClick={() => navigate('/pricing')}>
                  Credits: <span className="text-[#A6FF5D]">{credits}</span>
                </button>
                <UserButton size="icon"/>
              </div>
            )}
          </div>

          {/* Open Button (Mobile Only) */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all active:scale-90"
          >
            <Menu size={24} />
          </button>

        </div>
      </nav>
    </>
  );
};

export default Navbar;
