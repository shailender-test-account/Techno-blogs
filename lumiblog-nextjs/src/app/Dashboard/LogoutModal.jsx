'use client';
import api from '@/axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutModal({ isOpen, onClose, addToast }) {
  const router=useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setIsLoggingOut(true)

      const response = await api.post("/api/auth/logout");
      if (response.data.success) {
        setIsLoggingOut(false);
        addToast('Logged out successfully!', 'info');
        onClose();
        router.push("/")
        localStorage.clear()
      }
      else{
        setIsLoggingOut(false)
         addToast(response.data.message, 'info');


      }

    } catch (error) {
      setIsLoggingOut(false)
      console.log(error)

    }
    setIsLoggingOut(true);
    setTimeout(() => {
      setIsLoggingOut(false);
      addToast('Logged out successfully!', 'info');
      onClose();
    }, 1200);
  };



  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-fade-in-up">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <i className="fa-solid fa-arrow-right-from-bracket text-2xl"></i>
          </div>
        </div>
        <h3 className="text-lg font-bold text-center text-gray-800 mb-2">Confirm Logout</h3>
        <p className="text-sm text-center text-gray-500 mb-6">Are you sure you want to log out of your account?</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoggingOut}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {isLoggingOut ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Logging out...
              </>
            ) : (
              'Logout'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}