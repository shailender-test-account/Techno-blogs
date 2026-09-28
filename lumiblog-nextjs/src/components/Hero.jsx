"use client";

import Image from "next/image";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section className="relative pt-28 lg:pt-32 pb-8 w-full min-h-[calc(100vh-6rem)] flex items-center">
      <div className="absolute top-10 left-0 w-64 md:w-96 h-64 md:h-96 bg-brand-lightPink rounded-full blur-3xl opacity-60 -z-10 animate-float"></div>
      <div className="absolute bottom-0 right-0 w-80 md:w-[500px] h-80 md:h-[500px] bg-brand-purpleLight rounded-full blur-3xl opacity-40 -z-10"></div>

      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <Reveal className="w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lightPink text-brand-pink text-xs font-medium mb-4 lg:mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse"></span>
              FEATURED STORY
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 lg:mb-6 text-brand-dark">
              Stories that <br />
              <span className="text-brand-pink italic font-serif">Inspire</span> <br />
              and Connect
            </h1>

            <p className="text-brand-gray text-base sm:text-lg mb-6 lg:mb-8 max-w-md leading-relaxed">
              Thoughtful articles on lifestyle, travel, wellness and everything in between.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8 lg:mb-10">
              <button className="bg-brand-pink hover:bg-rose-600 text-white px-6 sm:px-8 py-3.5 rounded-full font-medium transition shadow-lg shadow-rose-200 hover:shadow-rose-300 transform hover:-translate-y-0.5 flex items-center gap-2 text-sm sm:text-base">
                Explore Articles <i className="fa-solid fa-arrow-right text-sm"></i>
              </button>

              <button className="flex items-center gap-3 group text-brand-dark font-medium hover:text-brand-pink transition text-sm sm:text-base">
                <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-brand-pink transition bg-white shadow-sm">
                  <i className="fa-solid fa-play text-brand-pink ml-1 text-xs sm:text-sm"></i>
                </span>
                Watch Video
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Reader 1"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80"
                  alt="Reader 2"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="Reader 3"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover"
                />
              </div>
              <p className="text-xs sm:text-sm font-medium text-brand-dark">
                Join 15K+ readers <br />{" "}
                <span className="text-brand-gray font-normal">who love our stories</span>
              </p>
            </div>
          </Reveal>

          <Reveal className="relative lg:ml-10 w-full mt-10 lg:mt-0 flex justify-center lg:justify-end">
            <div className="absolute -bottom-8 -left-8 z-10 opacity-70 hidden sm:block">
              <i className="fa-solid fa-leaf text-5xl text-green-300 transform -rotate-45"></i>
            </div>

            <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl h-[300px] sm:h-[400px] lg:h-[500px] w-full max-w-[500px] lg:max-w-none">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80"
                alt="Featured Landscape"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            <div className="absolute -bottom-6 right-2 sm:bottom-4 sm:right-4 lg:bottom-6 lg:-right-4 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xl max-w-[220px] sm:max-w-[260px] border border-gray-100 z-20 animate-float-delayed">
              <i className="fa-solid fa-quote-left text-brand-pink text-lg sm:text-xl mb-2 opacity-50"></i>
              <p className="text-brand-dark font-serif italic text-xs sm:text-sm leading-snug mb-2">
                &quot;The world is a book and those who do not travel read only one page.&quot;
              </p>
              <p className="text-brand-gray text-[10px] sm:text-xs font-medium">— Saint Augustine</p>
              <div className="absolute -bottom-3 -right-3 bg-brand-pink text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg">
                <i className="fa-solid fa-quote-right text-[10px] sm:text-xs"></i>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
