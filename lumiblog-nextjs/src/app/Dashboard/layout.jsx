'use client';

import { useState } from 'react';
import Toast from './Toast';
import Sidebar from './Sidebar';
import Header from './Header';

import LogoutModal from './LogoutModal';

export default function DashboardLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-gray-50/50">
      <Toast toasts={toasts} setToasts={setToasts} />

      <Sidebar
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
          onLogoutClick={() => setIsLogoutOpen(true)}
        />

        {/* Dynamic route children render here */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </div>
      </main>

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        addToast={addToast}
      />
    </div>
  );
}