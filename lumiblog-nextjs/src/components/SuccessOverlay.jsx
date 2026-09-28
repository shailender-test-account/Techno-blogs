"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideSuccessOverlay } from "@/redux/slices/uiSlice";

const CONFETTI_COLORS = ["#F43F5E", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#FB923C"];

export default function SuccessOverlay() {
  const dispatch = useDispatch();
  const { visible, title, message, withConfetti } = useSelector(
    (state) => state.ui.successOverlay
  );

  // Auto-hide after a few seconds, same as the original setTimeout behavior
  useEffect(() => {
    if (!visible) return;
    const duration = withConfetti ? 3500 : 2500;
    const timer = setTimeout(() => dispatch(hideSuccessOverlay()), duration);
    return () => clearTimeout(timer);
  }, [visible, withConfetti, dispatch]);

  const confettiPieces = useMemo(() => {
    if (!withConfetti || !visible) return [];
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random(),
      rotated: Math.random() > 0.5,
    }));
  }, [withConfetti, visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-brand-dark/50 backdrop-blur-md transition-opacity duration-300 opacity-100"></div>
      <div className="relative bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-[90%] text-center transform scale-100 opacity-100 transition-all duration-500 pointer-events-auto">
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {confettiPieces.map((c) => (
            <span
              key={c.id}
              className="confetti"
              style={{
                left: `${c.left}%`,
                top: "-10px",
                backgroundColor: c.color,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
                borderRadius: c.rotated ? "2px" : "50%",
                transform: c.rotated ? "rotate(45deg)" : "none",
              }}
            />
          ))}
        </div>

        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-green-200 success-ring"></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-green-100 success-ring"
            style={{ animationDelay: "0.6s" }}
          ></div>
          <svg className="w-full h-full relative z-10" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-brand-dark mb-2">{title}</h3>
        <p className="text-brand-gray text-sm">{message}</p>

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-brand-gray">
          <i className="fa-solid fa-mug-hot text-brand-pink"></i>
          <span>Redirecting you to LumiBlog...</span>
        </div>
      </div>
    </div>
  );
}
