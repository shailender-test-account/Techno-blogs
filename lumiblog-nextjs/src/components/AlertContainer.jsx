"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeAlert } from "@/redux/slices/alertSlice";

const STYLES = {
  success: {
    bg: "bg-green-50 border-green-200",
    text: "text-green-800",
    icon: "fa-solid fa-circle-check text-green-500",
  },
  error: {
    bg: "bg-rose-50 border-rose-200",
    text: "text-rose-800",
    icon: "fa-solid fa-circle-exclamation text-brand-pink",
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-800",
    icon: "fa-solid fa-circle-info text-blue-500",
  },
};

function AlertItem({ alert }) {
  const dispatch = useDispatch();
  const style = STYLES[alert.type] || STYLES.info;

  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeAlert(alert.id)), 4000);
    return () => clearTimeout(timer);
  }, [alert.id, dispatch]);

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 p-3.5 rounded-xl shadow-lg border alert-enter-active ${style.bg} ${style.text}`}
    >
      <div className="text-lg">
        <i className={style.icon}></i>
      </div>
      <p className="text-sm font-medium flex-grow">{alert.message}</p>
      <button
        onClick={() => dispatch(removeAlert(alert.id))}
        className="text-gray-400 hover:text-gray-600 transition"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
}

export default function AlertContainer() {
  const alerts = useSelector((state) => state.alerts.list);

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[200] w-[90%] max-w-md pointer-events-none flex flex-col gap-3">
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} />
      ))}
    </div>
  );
}
