




"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { closeSubscriptionModal } from "@/redux/slices/subscriptionslice.js";
import { closeModal } from "@/redux/slices/modalSlice";
import { showSuccessOverlay } from "@/redux/slices/uiSlice";
import api from "@/axios.js";


const PLAN_DURATION_FALLBACK = {
  "1_month": 30,
  "3_months": 90,
  "6_months": 180,
  "1_year": 365,
  "1-month": 30,
  "3-months": 90,
  "6-months": 180,
  "1-year": 365,
};


let razorpayScriptPromise = null;

const loadRazorpayScript = () => {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      razorpayScriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
};

/* ------------------------------------------------------------------ */
/*  PLAN MAPPER — API -> UI                                            */
/* ------------------------------------------------------------------ */
const mapApiPlanToUi = (plan) => {
  const isPopular = plan.popular === true;
  const durationDays = Number(plan.duration_days) || 0;

  let tagColor = "text-gray-400";
  let stripeColor = "from-gray-300 to-gray-400";
  let priceColor = "text-brand-dark";
  let borderColor = "border-gray-100";
  let buttonClassName =
    "border-2 border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white";

  if (isPopular) {
    tagColor = "text-brand-pink";
    stripeColor = "from-brand-pink to-rose-400";
    priceColor = "text-brand-pink";
    borderColor = "border-brand-pink";
    buttonClassName =
      "bg-brand-pink text-white hover:bg-rose-600 shadow-lg shadow-rose-200";
  } else if (plan.plan_key === "1_year" || durationDays >= 365) {
    tagColor = "text-amber-500";
    stripeColor = "from-amber-300 to-amber-500";
    borderColor = "border-gray-100";
    buttonClassName =
      "border-2 border-amber-400 text-amber-500 hover:bg-amber-400 hover:text-white";
  }

  const features = (plan.features || []).map((text) => ({
    text,
    included: true,
  }));

  return {
    key: plan.plan_key,
    tagLabel: plan.tag_label || (isPopular ? "Best Value" : "Starter"),
    tagColor,
    stripeColor,
    title: plan.title || plan.plan_name,
    price: plan.price_display || `₹${plan.price}`,
    priceColor,
    period: plan.period === "month" ? "/mo" : null,
    originalPrice:
      plan.original_price && Number(plan.original_price) > Number(plan.price)
        ? `₹${Number(plan.original_price).toLocaleString("en-IN")}`
        : null,
    popular: isPopular,
    borderColor,
    features,
    buttonClassName,
    planName: plan.plan_name,
    planKey: plan.plan_key,          // raw key sent to backend
    priceValue: Number(plan.price),
    durationDays,
  };
};


const useToast = () => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const show = useCallback((message, type = "error") => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type });
    timerRef.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const ToastNode = toast ? (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[300] px-4 py-3 rounded-xl shadow-2xl text-sm font-medium text-white ${
        toast.type === "error" ? "bg-red-500" : "bg-green-500"
      }`}
    >
      {toast.message}
    </div>
  ) : null;

  return { show, ToastNode };
};

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */
export default function SubscriptionModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.subscription.isOpen);

  // Try multiple possible auth slice shapes
  // const user = useSelector(
  //   (state) =>
  //     state.auth?.user ||
  //     state.user?.user ||
  //     state.user?.currentUser ||
  //     state.user?.data ||
  //     null
  // );

  const user=useSelector((state)=>state.auth?.currentuser)

  const userId = user?.id || user?._id || user?.userId || null;
  console.log("my user id",userId)

  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [processingKey, setProcessingKey] = useState(null);

  const { show: showToast, ToastNode } = useToast();

  /* -------------------- Fetch plans when modal opens ------------------ */
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: json } = await api.get("/api/plan/allplans", {
          params: { active: true },
        });

        if (cancelled) return;

        if (json?.success && Array.isArray(json.data)) {
          setPlans(json.data.map(mapApiPlanToUi));
        } else {
          setPlans([]);
          setError("No plans available");
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to fetch plans:", err);
        setError(err?.response?.data?.message || "Failed to load plans");
        setPlans([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPlans();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  /* ---------------------- Mount / animate lifecycle ------------------- */
  useEffect(() => {
    if (isOpen) {
      dispatch(closeModal());
      setMounted(true);
      const raf = requestAnimationFrame(() => setAnimateIn(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setMounted(false), 400);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* ----------------------------- Handlers ----------------------------- */
  const handleClose = useCallback(() => {
    if (processingKey) return; // block closing during payment
    dispatch(closeSubscriptionModal());
  }, [dispatch, processingKey]);

  const resetProcessing = () => setProcessingKey(null);

  const handleChoosePlan = async (plan) => {
    if (processingKey) return; // guard double-click

    if (!userId) {
      showToast("Please log in to continue with payment.");
      return;
    }

    setProcessingKey(plan.key);

    try {
      /* 1. Load Razorpay SDK */
      const sdkReady = await loadRazorpayScript();
      if (!sdkReady) {
        throw new Error("Failed to load Razorpay SDK. Check your network.");
      }

      /* 2. Create order on backend */
      const { data: orderRes } = await api.post(
        `/api/payment/create-order`,
        {
          planKey: plan.planKey,
          planName: plan.planName,
          amount: plan.priceValue,
          userId,
        },
        { timeout: 15000 }
      );

      if (!orderRes?.success || !orderRes?.order?.id) {
        throw new Error(orderRes?.message || "Failed to create order");
      }

      const { order, key, user: rzpUser } = orderRes;

      if (!key) throw new Error("Razorpay key not returned by server");

      /* 3. Razorpay checkout options */
      const options = {
        key,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Your App Name", // <-- change me
        description: `${plan.planName} Subscription`,
        order_id: order.id,
        prefill: {
          name: rzpUser?.name || user?.name || "",
          email: rzpUser?.email || user?.email || "",
          contact: user?.phone || user?.mobile || "",
        },
        notes: {
          planKey: plan.planKey,
          planName: plan.planName,
          userId: String(userId),
        },
        theme: { color: "#ec4899" }, // brand pink

        /* Called only on successful payment */
        handler: async function (response) {
          try {
            const { data: verifyRes } = await api.post(
              `api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { timeout: 15000 }
            );

            if (!verifyRes?.success) {
              throw new Error(
                verifyRes?.message || "Payment verification failed"
              );
            }

            // Close modal & show success overlay
            resetProcessing();
            dispatch(closeSubscriptionModal());
            dispatch(
              showSuccessOverlay({
                title: "Payment Successful! 🎉",
                message: `You're now subscribed to the ${plan.planName} plan.`,
                withConfetti: true,
                duration: 2800,
              })
            );
          } catch (err) {
            console.error("Verify error:", err);
            resetProcessing();
            showToast(
              err?.response?.data?.message ||
                err.message ||
                "Payment verification failed"
            );
          }
        },

        modal: {
          // Fires when user closes the Razorpay modal (either X or esc)
          ondismiss: function () {
            resetProcessing();
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response?.error);
        resetProcessing();
        showToast(
          response?.error?.description ||
            "Payment failed. Please try again."
        );
      });

      rzp.open();
    } catch (err) {
      console.error("Payment init error:", err);
      resetProcessing();
      showToast(
        err?.response?.data?.message ||
          err.message ||
          "Could not start payment"
      );
    }
  };

  /* ------------------------------- Render ------------------------------ */
  if (!mounted) return null;

  return (
    <>
      {ToastNode}

      <div className="fixed inset-0 z-[160] flex items-center justify-center p-2 sm:p-3 md:p-4">
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-brand-dark/60 backdrop-blur-md transition-opacity duration-300 ${
            animateIn ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleClose}
        />

        {/* Modal */}
        <div
          className={`relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl flex flex-col overflow-hidden z-10 transform transition-all duration-500 max-h-[95vh] ${
            animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-brand-lightPink via-white to-brand-purpleLight p-3 sm:p-4 text-center relative flex-shrink-0 border-b border-rose-100">
            <div className="absolute -top-8 -right-8 text-6xl text-white/40 rotate-12">
              <i className="fa-solid fa-crown" />
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-1 shadow-md relative z-10">
              <i className="fa-solid fa-star text-brand-pink text-base sm:text-lg" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-dark relative z-10 mb-0.5">
              Choose Your Plan
            </h3>
            <p className="text-brand-gray text-[11px] sm:text-xs relative z-10 max-w-md mx-auto">
              Unlock unlimited stories. Cancel anytime.
            </p>
          </div>

          {/* Body */}
          <div className="p-3 sm:p-4 md:p-5 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-brand-pink/30 border-t-brand-pink rounded-full animate-spin" />
                  <p className="text-brand-gray text-xs">Loading plans...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-2 text-center">
                  <i className="fa-solid fa-circle-exclamation text-brand-pink text-2xl" />
                  <p className="text-brand-gray text-xs">{error}</p>
                </div>
              </div>
            ) : plans.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-brand-gray text-xs">
                  No plans available right now.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3 md:gap-4">
                {plans.map((plan) => {
                  const isProcessing = processingKey === plan.key;
                  const anyProcessing = !!processingKey;

                  return (
                    <div
                      key={plan.key}
                      className={`plan-card ${
                        plan.popular ? "popular-glow" : ""
                      } bg-white rounded-xl sm:rounded-2xl border-2 ${
                        plan.borderColor
                      } p-3 sm:p-4 flex flex-col relative overflow-hidden shadow-sm ${
                        plan.popular
                          ? "shadow-xl sm:transform sm:scale-[1.02] z-10"
                          : ""
                      }`}
                    >
                      <div
                        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${plan.stripeColor}`}
                      />

                      {plan.popular && (
                        <div className="absolute -top-2 -right-2">
                          <span className="badge-pop bg-brand-pink text-white text-[8px] sm:text-[9px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg shadow-md">
                            POPULAR
                          </span>
                        </div>
                      )}

                      <div className="mb-2 sm:mb-3">
                        <span
                          className={`text-[9px] sm:text-[10px] font-bold tracking-wider uppercase ${plan.tagColor}`}
                        >
                          {plan.tagLabel}
                        </span>
                        <h4 className="text-base sm:text-lg md:text-xl font-bold text-brand-dark mt-0.5">
                          {plan.title}
                        </h4>
                      </div>

                      <div className="mb-2 sm:mb-3">
                        <span
                          className={`plan-price font-bold ${plan.priceColor}`}
                        >
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className="text-brand-gray text-[10px] sm:text-xs">
                            {plan.period}
                          </span>
                        )}
                        {plan.originalPrice && (
                          <span className="text-brand-gray text-[10px] sm:text-xs line-through ml-1">
                            {plan.originalPrice}
                          </span>
                        )}
                      </div>

                      <ul className="space-y-1 sm:space-y-1.5 plan-feature text-brand-dark mb-3 sm:mb-4 flex-grow">
                        {plan.features.map((f) => (
                          <li
                            key={f.text}
                            className={`flex items-center gap-1.5 ${
                              f.included ? "" : "text-gray-400"
                            }`}
                          >
                            <i
                              className={`fa-solid ${
                                f.included
                                  ? "fa-check-circle text-brand-pink"
                                  : "fa-circle-xmark"
                              } text-[10px]`}
                            />{" "}
                            {f.text}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleChoosePlan(plan)}
                        disabled={isProcessing || anyProcessing}
                        className={`w-full py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-[11px] sm:text-xs md:text-sm ${
                          plan.buttonClassName
                        } ${
                          isProcessing || anyProcessing
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {isProcessing ? (
                          <span className="inline-flex items-center gap-2 justify-center">
                            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : (
                          "Choose Plan"
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-3 py-2 text-center text-[9px] sm:text-[10px] text-brand-gray border-t border-gray-100 flex-shrink-0">
            <i className="fa-solid fa-lock text-brand-pink mr-1" /> Secure
            payment. Cancel anytime.
          </div>

          {/* Close */}
          <button
            onClick={handleClose}
            disabled={!!processingKey}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-dark hover:bg-white hover:text-brand-pink transition shadow-md z-30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-xmark text-[10px] sm:text-xs" />
          </button>
        </div>
      </div>
    </>
  );
}
