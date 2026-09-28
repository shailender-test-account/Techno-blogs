"use client";

import Reveal from "./Reveal";

const TRENDS = [
  "Digital Nomad Tips",
  "Minimalism",
  "Healthy Living",
  "Travel Guides",
  "Productivity",
];

export default function TrendingBar() {
  return (
    <Reveal
      as="section"
      className="border-y border-gray-100 py-4 lg:py-5 bg-white w-full rounded-2xl mb-8 shadow-sm"
    >
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
            <div className="w-8 h-8 rounded-full bg-brand-lightPink flex items-center justify-center text-brand-pink">
              <i className="fa-solid fa-arrow-trend-up text-sm"></i>
            </div>
            <span className="font-bold text-brand-pink tracking-wider text-xs sm:text-sm">
              TRENDING NOW
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:gap-8 text-xs sm:text-sm font-medium text-brand-dark w-full md:w-auto">
            {TRENDS.map((trend) => (
              <a
                key={trend}
                href="#"
                className="hover:text-brand-pink transition flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-pink"></span> {trend}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
