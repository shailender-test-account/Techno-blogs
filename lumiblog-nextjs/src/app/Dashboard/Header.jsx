'use client';

import { useSelector } from "react-redux";

export default function Header({ mobileSidebarOpen, setMobileSidebarOpen, onLogoutClick }) {
  const user=useSelector((state)=>state.auth?.currentuser)
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
      <button
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="md:hidden text-gray-500 hover:text-indigo-600 mr-4 transition-colors"
      >
        <i className="fa-solid fa-bars text-xl"></i>
      </button>

      <div className="hidden sm:flex items-center bg-gray-50 rounded-xl px-4 py-2.5 w-96 border border-gray-200 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/20 transition-all">
        <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-transparent border-none outline-none ml-3 w-full text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative cursor-pointer text-gray-500 hover:text-indigo-600 transition-colors p-2 hover:bg-gray-50 rounded-lg">
          <i className="fa-regular fa-envelope text-xl"></i>
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
            3
          </span>
        </div>
        <div className="relative cursor-pointer text-gray-500 hover:text-indigo-600 transition-colors p-2 hover:bg-gray-50 rounded-lg">
          <i className="fa-regular fa-bell text-xl"></i>
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
            5
          </span>
        </div>

        <div className="w-px h-8 bg-gray-200 mx-2"></div>

        <div className="flex items-center cursor-pointer group">
          <img
            src="https://i.pravatar.cc/150?img=11"
            alt="Admin"
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm group-hover:border-indigo-600 transition-colors"
          />
          <div className="ml-3 hidden lg:block">
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={onLogoutClick}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-500 hover:text-red-600 transition-all border border-transparent hover:border-red-100 ml-2"
        >
          <i className="fa-solid fa-arrow-right-from-bracket text-lg"></i>
          <span className="text-sm font-medium hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
}