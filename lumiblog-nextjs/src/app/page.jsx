"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "@/redux/slices/modalSlice";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrendingBar from "@/components/TrendingBar";
import FeaturedArticles from "@/components/FeaturedArticles";
import EditorsPicks from "@/components/EditorsPicks";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import AlertContainer from "@/components/AlertContainer";
import SuccessOverlay from "@/components/SuccessOverlay";
import SubscriptionModal from "@/components/Subscriptionmodla";

export default function HomePage() {
  const dispatch = useDispatch();
  const modalIsOpen = useSelector((state) => state.modal.isOpen);
  const subispopen=useSelector((state)=>state.subscription.isOpen);


  // Auto-open the login modal 3s after load, same as the original page,
  // but skip it if the user has already opened/interacted with the modal.
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(openModal("login"));
    }, 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AlertContainer />
      <SuccessOverlay />
      <Navbar />

      <main className="w-[95%] max-w-[95vw] mx-auto overflow-hidden">
        <Hero />
        <TrendingBar />
        <FeaturedArticles />
        <EditorsPicks />
      </main>

      <Footer />

      {modalIsOpen && <AuthModal />}
      {subispopen && <SubscriptionModal/>}
    </>
  );
}
