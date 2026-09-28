'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ mobileSidebarOpen, setMobileSidebarOpen }) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <aside
      className={`w-72 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 absolute md:relative z-30 h-full shadow-xl md:shadow-none ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="h-20 flex items-center px-6 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white mr-3 shadow-lg shadow-blue-200">
          <i className="fa-solid fa-graduation-cap text-xl"></i>
        </div>
        <div>
          <h1 className="font-bold text-gray-800 text-lg leading-tight">Brand Header</h1>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
        <Link
          href="/Dashboard/add-blog"
          onClick={handleLinkClick}
          className={`sidebar-item flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all cursor-pointer group ${
            pathname === '/Dashboard/add-blog' ? 'active' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
            <i className="fa-solid fa-plus text-sm"></i>
          </div>
          <span className="ml-3 font-medium text-sm">Add Blog Form</span>
          <i className="fa-solid fa-chevron-right ml-auto text-xs text-gray-400 group-hover:text-indigo-600 transition-colors"></i>
        </Link>

        <Link
          href="/Dashboard/add-subscription"
          onClick={handleLinkClick}
          className={`sidebar-item flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all cursor-pointer group ${
            pathname === '/Dashboard/add-subscription' ? 'active' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
            <i className="fa-solid fa-crown text-sm"></i>
          </div>
          <span className="ml-3 font-medium text-sm">Add Subscription</span>
          <i className="fa-solid fa-chevron-right ml-auto text-xs text-gray-400 group-hover:text-indigo-600 transition-colors"></i>
        </Link>

        <div className="py-2">
          <div className="border-t border-gray-100"></div>
        </div>

        <Link
          href="/Dashboard/blogs"
          onClick={handleLinkClick}
          className={`sidebar-item flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all cursor-pointer group ${
            pathname === '/Dashboard/blogs' ? 'active' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors">
            <i className="fa-solid fa-list text-sm"></i>
          </div>
          <span className="ml-3 font-medium text-sm">Blog Table List</span>
        </Link>

        <Link
          href="/Dashboard/subscriptions"
          onClick={handleLinkClick}
          className={`sidebar-item flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all cursor-pointer group ${
            pathname === '/Dashboard/subscriptions' ? 'active' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors">
            <i className="fa-solid fa-file-invoice-dollar text-sm"></i>
          </div>
          <span className="ml-3 font-medium text-sm">Subscription Table</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer px-4 py-2">
          <i className="fa-regular fa-circle-question text-xl"></i>
          <span className="ml-3 font-medium text-sm">Help Line</span>
        </div>
      </div>
    </aside>
  );
}