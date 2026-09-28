

"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { openModal } from "@/redux/slices/modalSlice";
import Reveal from "./Reveal";
import api from "@/axios";

const API_URL = "http://localhost:5000/api/blog/allblogs";

const CATEGORIES = [
  { name: "Travel", icon: "fa-plane", color: "blue", count: "24 Articles" },
  { name: "Lifestyle", icon: "fa-mug-hot", color: "pink", count: "32 Articles" },
  { name: "Wellness", icon: "fa-leaf", color: "green", count: "18 Articles" },
  { name: "Personal Growth", icon: "fa-book-open", color: "purple", count: "26 Articles" },
  { name: "Photography", icon: "fa-camera", color: "orange", count: "15 Articles" },
  { name: "Business", icon: "fa-home", color: "orange", count: "15 Articles" },
];

const colorClasses = {
  blue: "bg-blue-50 text-blue-500 group-hover:bg-blue-500",
  pink: "bg-pink-50 text-brand-pink group-hover:bg-brand-pink",
  green: "bg-green-50 text-green-500 group-hover:bg-green-500",
  purple: "bg-purple-50 text-purple-500 group-hover:bg-purple-500",
  orange: "bg-orange-50 text-orange-500 group-hover:bg-orange-500",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

const estimateReadTime = (content = "") => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

const normalizeBlog = (blog) => ({
  id: blog.id,
  title: blog.title,
  category: blog.category || "Lifestyle",
  image:
    blog.image ||
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
  author_name: blog.author_name || "Unknown",
  author_avatar:
    blog.author_avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      blog.author_name || "A"
    )}&background=random`,
  meta: `${formatDate(blog.published_at || blog.created_at)} • ${estimateReadTime(
    blog.content
  )}`,
  excerpt: blog.excerpt || "",
});

export default function FeaturedArticles() {
  const dispatch = useDispatch();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Lifestyle");

  const handleSubscribe = (e) => {
    e.preventDefault();
    dispatch(openModal("login"));
  };

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
  };

  const fetchBlogs = useCallback(async (category) => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/blog/allblogs", {
        params: { category },
      });

      const rawBlogs = Array.isArray(data)
        ? data
        : Array.isArray(data?.blogs)
        ? data.blogs
        : [];

      // status "published" is mandatory
      const publishedBlogs = rawBlogs
        .filter((b) => b?.status === "published")
        .map(normalizeBlog);

      return publishedBlogs;
    } catch (err) {
      console.error("Failed to fetch blogs:", err?.message || err);
      return [];
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const result = await fetchBlogs(activeCategory);
      if (isMounted) {
        setBlogs(result);
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [activeCategory, fetchBlogs]);

  const card1 = blogs[0];
  const card2 = blogs[1];
  const card3 = blogs[2];

  return (
    <section className="py-16 sm:py-20 bg-brand-bg w-full rounded-3xl mb-8">
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        <Reveal className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-dark">
              Featured Articles
            </h2>
            <p className="text-brand-gray text-xs sm:text-sm mt-1">
              Showing:{" "}
              <span className="text-brand-pink font-medium">{activeCategory}</span>
              {loading && <span className="ml-2 text-brand-gray">• Loading…</span>}
            </p>
          </div>
          <a
            href="#"
            className="text-brand-pink font-medium hover:text-rose-600 transition flex items-center gap-2 text-sm sm:text-base"
          >
            View all articles{" "}
            <i className="fa-solid fa-arrow-right text-xs sm:text-sm"></i>
          </a>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full">
            {/* Loading skeleton */}
            {loading &&
              [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse w-full ${
                    i === 2 ? "sm:col-span-2 h-56" : "h-80"
                  }`}
                >
                  <div className="w-full h-full bg-gray-100" />
                </div>
              ))}

            {/* Empty state */}
            {!loading && blogs.length === 0 && (
              <div className="sm:col-span-2 bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center w-full">
                <div className="text-4xl text-brand-pink mb-3">
                  <i className="fa-regular fa-face-frown"></i>
                </div>
                <h3 className="text-lg font-bold text-brand-dark mb-1">
                  No articles found
                </h3>
                <p className="text-brand-gray text-sm">
                  There are no published articles in{" "}
                  <span className="font-medium">{activeCategory}</span> yet.
                </p>
              </div>
            )}

            {/* Card 1 */}
            {!loading && card1 && (
              <Reveal
                as="article"
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col w-full"
              >
                <div className="relative overflow-hidden h-48 sm:h-56">
                  <img
                    src={card1.image}
                    alt={card1.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-pink text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {card1.category}
                  </span>
                </div>
                <div className="p-5 sm:p-6 flex flex-col flex-grow">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-brand-pink transition line-clamp-2">
                    <a href="#">{card1.title}</a>
                  </h3>
                  <div className="mt-auto flex items-center justify-between text-[10px] sm:text-xs text-brand-gray">
                    <span>{card1.meta}</span>
                    <div className="flex items-center gap-2">
                      <img
                        src={card1.author_avatar}
                        alt={card1.author_name}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                      />
                      <span className="font-medium text-brand-dark">
                        {card1.author_name}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}

            {/* Card 2 */}
            {!loading && card2 && (
              <Reveal
                as="article"
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col w-full"
              >
                <div className="relative overflow-hidden h-48 sm:h-56">
                  <img
                    src={card2.image}
                    alt={card2.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-pink text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {card2.category}
                  </span>
                </div>
                <div className="p-5 sm:p-6 flex flex-col flex-grow">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-brand-pink transition line-clamp-2">
                    <a href="#">{card2.title}</a>
                  </h3>
                  <div className="mt-auto flex items-center justify-between text-[10px] sm:text-xs text-brand-gray">
                    <span>{card2.meta}</span>
                    <div className="flex items-center gap-2">
                      <img
                        src={card2.author_avatar}
                        alt={card2.author_name}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                      />
                      <span className="font-medium text-brand-dark">
                        {card2.author_name}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}

            {/* Card 3 — wide */}
            {!loading && card3 && (
              <Reveal
                as="article"
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col sm:col-span-2 w-full"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="relative overflow-hidden h-48 sm:h-full">
                    <img
                      src={card3.image}
                      alt={card3.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-pink text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {card3.category}
                    </span>
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col justify-center">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-brand-pink transition">
                      <a href="#">{card3.title}</a>
                    </h3>
                    {card3.excerpt && (
                      <p className="text-brand-gray text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2">
                        {card3.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-brand-gray mt-auto">
                      <span>{card3.meta}</span>
                      <div className="flex items-center gap-2">
                        <img
                          src={card3.author_avatar}
                          alt={card3.author_name}
                          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                        />
                        <span className="font-medium text-brand-dark">
                          {card3.author_name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          <Reveal className="space-y-6 sm:space-y-8 w-full">
            <div className="bg-gradient-to-br from-brand-lightPink to-brand-purpleLight rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-sm border border-rose-100 w-full">
              <div className="absolute -top-6 -right-6 text-5xl sm:text-6xl text-white/40 rotate-12">
                <i className="fa-solid fa-envelope-open-text"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 relative z-10">
                Get stories straight to your inbox
              </h3>
              <p className="text-brand-gray text-xs sm:text-sm mb-6 relative z-10">
                Join our community and never miss an inspiring story.
              </p>

              <form onSubmit={handleSubscribe} className="relative z-10 w-full">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl border border-white/50 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none text-xs sm:text-sm mb-3 bg-white/80 backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="w-full bg-brand-pink hover:bg-rose-600 text-white font-medium py-3 rounded-xl transition shadow-lg shadow-rose-200 text-sm sm:text-base"
                >
                  Subscribe
                </button>
              </form>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg sm:text-xl font-bold">
                  Popular Categories
                </h3>
                <a
                  href="#"
                  className="text-brand-pink text-xs sm:text-sm font-medium hover:underline flex items-center gap-1"
                >
                  Explore all{" "}
                  <i className="fa-solid fa-arrow-right text-[10px] sm:text-xs"></i>
                </a>
              </div>

              <ul className="space-y-4">
                {CATEGORIES.map((cat) => {
                  const isActive =
                    cat.name.toLowerCase() === activeCategory.toLowerCase();
                  return (
                    <li
                      key={cat.name}
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`flex items-center justify-between group cursor-pointer rounded-xl px-3 py-2 transition ${
                        isActive
                          ? "bg-brand-pink/5 ring-1 ring-brand-pink/30"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:text-white transition ${
                            colorClasses[cat.color]
                          } ${isActive ? "text-white" : ""}`}
                        >
                          <i
                            className={`fa-solid ${cat.icon} text-xs sm:text-sm`}
                          ></i>
                        </div>
                        <span
                          className={`font-medium transition text-sm sm:text-base ${
                            isActive
                              ? "text-brand-pink"
                              : "text-brand-dark group-hover:text-brand-pink"
                          }`}
                        >
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-xs text-brand-gray bg-gray-50 px-2 py-1 rounded-md">
                        {cat.count}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}



