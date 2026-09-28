"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { openModal } from "@/redux/slices/modalSlice";
import api from "@/axios";

export default function Navbar() {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const checkAuth = useCallback(() => {
    if (typeof window === "undefined") return;
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("user") ||
      sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [checkAuth]);

  

;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <div
        className={`w-[95%] max-w-[95vw] mx-auto mt-4 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm transition-colors ${
          scrolled ? "bg-white shadow-md" : "bg-white/95"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight">
                Lumi<span className="text-brand-pink">Blog</span>
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-brand-pink font-medium border-b-2 border-brand-pink pb-1 text-sm"
              >
                Home
              </a>
              <div className="relative group">
                <a
                  href="#"
                  className="text-brand-gray hover:text-brand-dark transition flex items-center gap-1 text-sm"
                >
                  Categories <i className="fa-solid fa-chevron-down text-xs mt-1"></i>
                </a>
              </div>
              <a href="#" className="text-brand-gray hover:text-brand-dark transition text-sm">
                About
              </a>
              <div className="relative group">
                <a
                  href="#"
                  className="text-brand-gray hover:text-brand-dark transition flex items-center gap-1 text-sm"
                >
                  Pages <i className="fa-solid fa-chevron-down text-xs mt-1"></i>
                </a>
              </div>
              <a href="#" className="text-brand-gray hover:text-brand-dark transition text-sm">
                Contact
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-5">
              <button className="text-brand-gray hover:text-brand-pink transition">
                <i className="fa-regular fa-moon text-lg"></i>
              </button>
              <button className="text-brand-gray hover:text-brand-pink transition">
                <i className="fa-solid fa-magnifying-glass text-lg"></i>
              </button>

             
                <button
                  type="button"
                  onClick={() => dispatch(openModal("login"))}
                  className="bg-brand-pink hover:bg-rose-600 text-white px-5 py-2 rounded-full font-medium transition shadow-md shadow-rose-200 hover:shadow-rose-300 transform hover:-translate-y-0.5 text-sm"
                >
                  Login
                </button>
            
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="text-brand-dark focus:outline-none"
              >
                <i className="fa-solid fa-bars text-2xl"></i>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg rounded-b-2xl ${
            menuOpen ? "" : "hidden"
          }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-1">
            <a
              href="#"
              className="block px-3 py-2 text-brand-pink font-medium rounded-md bg-brand-lightPink text-sm"
            >
              Home
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-brand-gray hover:text-brand-dark hover:bg-gray-50 rounded-md text-sm"
            >
              Categories
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-brand-gray hover:text-brand-dark hover:bg-gray-50 rounded-md text-sm"
            >
              About
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-brand-gray hover:text-brand-dark hover:bg-gray-50 rounded-md text-sm"
            >
              Pages
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-brand-gray hover:text-brand-dark hover:bg-gray-50 rounded-md text-sm"
            >
              Contact
            </a>
            <div className="pt-4 border-t border-gray-100 mt-2 flex items-center justify-between px-3">
              <div className="flex space-x-4">
                <button className="text-brand-gray">
                  <i className="fa-regular fa-moon"></i>
                </button>
                <button className="text-brand-gray">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>

             
                <button
                  type="button"
                  onClick={() => dispatch(openModal("login"))}
                  className="bg-brand-pink text-white px-5 py-2 rounded-full text-sm font-medium"
                >
                  Login
                </button>
              
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}