


"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { openModal } from "@/redux/slices/modalSlice";
import Reveal from "./Reveal";
import api from "@/axios";
import { openSubscriptionModal } from "@/redux/slices/subscriptionslice.js";

import { useDispatch } from "react-redux";
import Link from "next/link";

/* ─────────────────────────── CONSTANTS ─────────────────────────── */

const CATEGORIES = [
  { name: "Travel", icon: "fa-plane", color: "blue" },
   { name: "Technology", icon: "fa-gear", color: "teal" },
  { name: "Lifestyle", icon: "fa-mug-hot", color: "pink" },
  { name: "Wellness", icon: "fa-leaf", color: "green" },
  { name: "Personal Growth", icon: "fa-book-open", color: "purple" },
  { name: "Photography", icon: "fa-camera", color: "orange" },
  { name: "Business", icon: "fa-home", color: "orange" },
];

const COLOR_CLASSES = {
  blue: "bg-blue-50 text-blue-500 group-hover:bg-blue-500",
  pink: "bg-pink-50 text-brand-pink group-hover:bg-brand-pink",
  green: "bg-green-50 text-green-500 group-hover:bg-green-500",
  purple: "bg-purple-50 text-purple-500 group-hover:bg-purple-500",
  orange: "bg-orange-50 text-orange-500 group-hover:bg-orange-500",
};

/* ─────────────────────────── HELPERS ─────────────────────────── */

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


const handelsubscriptionmodel = () => {
  setTimeout(() => {
    dispatch(openSubscriptionModal());
  }, 2500 + 300);
}

const estimateReadTime = (content = "") => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
};

const normalizeBlog = (blog) => ({
  id: blog._id || blog.id,
  title: blog.title || "Untitled",
  category: blog.category || "Lifestyle",
  image:
    blog.image ||
    blog.coverImage ||
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
  author_name:
    blog.author_name || blog.author?.name || blog.authorName || "Unknown",
  author_avatar:
    blog.author_avatar ||
    blog.author?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      blog.author_name || blog.author?.name || "A"
    )}&background=random`,
  excerpt: blog.excerpt || blog.description || "",
  content: blog.content || "",
  meta: `${formatDate(blog.published_at || blog.created_at)} • ${estimateReadTime(
    blog.content
  )}`,
  published_at: blog.published_at || blog.created_at,
});

/* ─────────────────────────── BLOG MODAL ─────────────────────────── */

function BlogDetailModal({ blog, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => onClose(), 350);
  };

  if (!blog) return null;
  const active = isVisible && !isClosing;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"
        }`}
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md"
      />

      {/* Modal card */}
      <div
        className={`relative w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-500 ease-out ${active
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
          }`}
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-brand-dark flex items-center justify-center shadow-lg hover:bg-brand-pink hover:text-white hover:rotate-90 transition-all duration-300"
        >
          <i className="fa-solid fa-xmark text-lg" />
        </button>

        <div className="overflow-y-auto max-h-[92vh] custom-scrollbar">
          {/* Hero */}
          <div className="relative h-56 sm:h-72 w-full overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title}
              className={`w-full h-full object-cover transition-transform duration-[1.2s] ease-out ${active ? "scale-100" : "scale-110"
                }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <span
              className={`absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-brand-pink text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg transition-all duration-500 delay-150 ${active
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
                }`}
            >
              {blog.category}
            </span>

            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <h2
                className={`text-xl sm:text-3xl font-bold text-white leading-tight drop-shadow-lg transition-all duration-500 delay-200 ${active
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                  }`}
              >
                {blog.title}
              </h2>
            </div>
          </div>

          {/* Meta */}
          <div
            className={`flex flex-wrap items-center justify-between gap-4 px-5 sm:px-7 py-4 border-b border-gray-100 transition-all duration-500 delay-300 ${active
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
              }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={blog.author_avatar}
                alt={blog.author_name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-pink/20"
              />
              <div>
                <p className="text-sm font-semibold text-brand-dark">
                  {blog.author_name}
                </p>
                <p className="text-xs text-brand-gray">{blog.meta}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {["fa-regular fa-heart", "fa-solid fa-share-nodes", "fa-regular fa-bookmark"].map(
                (icon) => (
                  <button
                    key={icon}
                    className="w-9 h-9 rounded-full bg-brand-pink/10 text-brand-pink flex items-center justify-center hover:bg-brand-pink hover:text-white transition-all duration-300"
                  >
                    <i className={`${icon} text-sm`} />
                  </button>
                )
              )}
            </div>
          </div>

          {/* Body */}
          <div
            className={`px-5 sm:px-7 py-6 transition-all duration-500 ${active
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
              }`}
            style={{ transitionDelay: "400ms" }}
          >
            {blog.excerpt && (
              <p className="text-brand-dark/80 text-base sm:text-lg font-medium italic border-l-4 border-brand-pink pl-4 mb-6">
                {blog.excerpt}
              </p>
            )}

            {blog.content ? (
              <div className="text-brand-gray leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {blog.content}
              </div>
            ) : (
              <p className="text-brand-gray text-sm">
                No content available for this article.
              </p>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-brand-gray">Tags:</span>
                {[blog.category, "Story", "Inspiration"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-brand-pink/10 text-brand-pink px-3 py-1 rounded-full hover:bg-brand-pink hover:text-white transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={handleClose}
                className="text-sm font-medium text-brand-pink hover:text-rose-600 transition flex items-center gap-2"
              >
                Close article
                <i className="fa-solid fa-arrow-right text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f9a8d4;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ec4899;
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────── CLAMPED TEXT WITH READ MORE ─────────────────────────── */

function ClampedText({ text, lines = 3, className = "" }) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Measure after paint to ensure fonts/layout are settled
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      setIsOverflowing(el.scrollHeight > el.clientHeight + 2);
    };

    measure();
    const t = setTimeout(measure, 100);

    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [text, lines]);

  if (!text) return null;

  return (
    <div className={`relative ${className}`}>
      <p
        ref={ref}
        className="text-brand-gray text-xs sm:text-sm leading-relaxed"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: lines,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {text}
      </p>

      {isOverflowing && (
        <span className="inline-flex items-center gap-1 mt-2 text-[11px] sm:text-xs font-semibold text-brand-pink hover:text-rose-600 transition-colors cursor-pointer group/readmore">
          Read more
          <i className="fa-solid fa-arrow-right text-[9px] sm:text-[10px] transition-transform duration-300 group-hover/readmore:translate-x-1" />
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────── EXPLORE MORE BUTTON ─────────────────────────── */

function ExploreMoreButton({ onClick }) {
  return (
    <div className="sm:col-span-2 flex justify-center mt-10 sm:mt-12 lg:mt-14 w-full">
      <button
        onClick={onClick}
        className="explore-btn group relative inline-flex items-center gap-3 px-7 sm:px-10 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base text-white overflow-hidden transition-all duration-500 ease-out shadow-lg shadow-rose-200/50 hover:shadow-2xl hover:shadow-rose-300/60 hover:-translate-y-1 active:translate-y-0"
      >
        {/* Animated gradient background */}
        <span className="absolute inset-0 bg-gradient-to-r from-brand-pink via-rose-500 to-brand-pink animate-gradient-shift" />

        {/* Shine sweep effect */}
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]" />

        {/* Glow pulse ring */}
        <span className="absolute inset-0 rounded-full ring-2 ring-brand-pink/0 group-hover:ring-brand-pink/40 transition-all duration-500" />

        <span className="relative z-10 flex items-center gap-2.5">
          Explore More Articles
          <span className="relative flex items-center justify-center w-6 h-6">
            <i className="fa-solid fa-arrow-right text-xs transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-0" />
            <i className="fa-solid fa-arrow-right text-xs absolute opacity-0 -translate-x-3 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
          </span>
        </span>
      </button>

      <style jsx>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
        .animate-gradient-shift {
          background-size: 200% 100%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────── MAIN COMPONENT ─────────────────────────── */

export default function FeaturedArticles() {
  const dispatch = useDispatch();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Lifestyle");
  const [selectedBlog, setSelectedBlog] = useState(null);

  /* Fetch blogs (filtered by category) */
  const fetchBlogs = useCallback(async (category) => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/blog/allblogs", {
        params: { category },
      });

      const raw = Array.isArray(data)
        ? data
        : Array.isArray(data?.blogs)
          ? data.blogs
          : [];

      return raw
        .filter((b) => !b?.status || b.status === "published")
        .map(normalizeBlog);
    } catch (err) {
      console.error("Failed to fetch blogs:", err?.message || err);
      return [];
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await fetchBlogs(activeCategory);
      if (mounted) {
        setBlogs(result);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [activeCategory, fetchBlogs]);

  const card1 = blogs[0];
  const card2 = blogs[1];
  const card3 = blogs[2];

  const handleSubscribe = (e) => {
    e.preventDefault();
    dispatch(openModal("login"));
  };

  const handleExploreMore = () => {
    // Hook this up to your routing logic:
    // import { useRouter } from "next/navigation";
    // const router = useRouter();
    // router.push("/blogs");
    console.log("Explore more clicked");
  };

  const categoryCounts = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat.name] = blogs.filter((b) => b.category === cat.name).length;
      return acc;
    }, {});
  }, [blogs]);

  return (
    <>
      <section className="py-16 sm:py-20 bg-brand-bg w-full rounded-3xl mb-8">
        <div className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
          {/* Header */}
          <Reveal className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-dark">
                Featured Articles
              </h2>
              <p className="text-brand-gray text-xs sm:text-sm mt-1">
                Showing:{" "}
                <span className="text-brand-pink font-medium">
                  {activeCategory}
                </span>
                {loading && (
                  <span className="ml-2 text-brand-gray">• Loading…</span>
                )}
              </p>
            </div>
            <Link
              href="#"
              
              onClick={handelsubscriptionmodel}
              className="text-brand-pink font-medium hover:text-rose-600 transition flex items-center gap-2 text-sm sm:text-base"
            >
              View all articles{" "}
              <i className="fa-solid fa-arrow-right text-xs sm:text-sm" />
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            {/* LEFT — Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full">
              {/* Skeletons */}
              {loading &&
                [0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse w-full ${i === 2 ? "sm:col-span-2 h-56" : "h-80"
                      }`}
                  >
                    <div className="w-full h-full bg-gray-100" />
                  </div>
                ))}

              {/* Empty state */}
              {!loading && blogs.length === 0 && (
                <div className="sm:col-span-2 bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center w-full">
                  <div className="text-4xl text-brand-pink mb-3">
                    <i className="fa-regular fa-face-frown" />
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

              {/* Card 1 (small) */}
              {!loading && card1 && (
                <Reveal
                  as="article"
                  onClick={() => setSelectedBlog(card1)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col w-full cursor-pointer h-[420px]"
                >
                  <div className="relative overflow-hidden h-48 sm:h-56 flex-shrink-0">
                    <img
                      src={card1.image}
                      alt={card1.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-pink text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {card1.category}
                    </span>
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col flex-grow min-h-0">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-brand-pink transition line-clamp-2">
                      {card1.title}
                    </h3>
                    {card1.excerpt && (
                      <ClampedText text={card1.excerpt} lines={3} />
                    )}
                    <div className="mt-auto pt-4 flex items-center justify-between text-[10px] sm:text-xs text-brand-gray">
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

              {/* Card 2 (small) */}
              {!loading && card2 && (
                <Reveal
                  as="article"
                  onClick={() => setSelectedBlog(card2)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col w-full cursor-pointer h-[420px]"
                >
                  <div className="relative overflow-hidden h-48 sm:h-56 flex-shrink-0">
                    <img
                      src={card2.image}
                      alt={card2.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-pink text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {card2.category}
                    </span>
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col flex-grow min-h-0">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-brand-pink transition line-clamp-2">
                      {card2.title}
                    </h3>
                    {card2.excerpt && (
                      <ClampedText text={card2.excerpt} lines={3} />
                    )}
                    <div className="mt-auto pt-4 flex items-center justify-between text-[10px] sm:text-xs text-brand-gray">
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

              {/* Card 3 (wide) */}
              {!loading && card3 && (
                <Reveal
                  as="article"
                  onClick={() => setSelectedBlog(card3)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col sm:col-span-2 w-full cursor-pointer h-auto sm:h-[280px]"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
                    <div className="relative overflow-hidden h-48 sm:h-full flex-shrink-0">
                      <img
                        src={card3.image}
                        alt={card3.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-pink text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {card3.category}
                      </span>
                    </div>
                    <div className="p-5 sm:p-6 flex flex-col justify-between min-h-0">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-brand-pink transition line-clamp-2">
                          {card3.title}
                        </h3>
                        {card3.excerpt && (
                          <ClampedText text={card3.excerpt} lines={3} />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-brand-gray mt-4">
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

              {/* Explore More Button */}
              {!loading && blogs.length > 0 && (
                <ExploreMoreButton onClick={handelsubscriptionmodel} />
              )}
            </div>

            {/* RIGHT — Newsletter + Categories */}
            <Reveal className="space-y-6 sm:space-y-8 w-full">
              {/* Newsletter */}
              <div className="bg-gradient-to-br from-brand-lightPink to-brand-purpleLight rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-sm border border-rose-100 w-full">
                <div className="absolute -top-6 -right-6 text-5xl sm:text-6xl text-white/40 rotate-12">
                  <i className="fa-solid fa-envelope-open-text" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 relative z-10">
                  Get stories straight to your inbox
                </h3>
                <p className="text-brand-gray text-xs sm:text-sm mb-6 relative z-10">
                  Join our community and never miss an inspiring story.
                </p>

                <form
                  onSubmit={handleSubscribe}
                  className="relative z-10 w-full"
                >
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

              {/* Categories */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 w-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-brand-dark">
                    Popular Categories
                  </h3>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-brand-pink text-xs sm:text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    Explore all{" "}
                    <i className="fa-solid fa-arrow-right text-[10px] sm:text-xs" />
                  </a>
                </div>

                <ul className="space-y-4">
                  {CATEGORIES.map((cat) => {
                    const isActive =
                      cat.name.toLowerCase() === activeCategory.toLowerCase();
                    return (
                      <li
                        key={cat.name}
                        onClick={() => setActiveCategory(cat.name)}
                        className={`flex items-center justify-between group cursor-pointer rounded-xl px-3 py-2 transition ${isActive
                            ? "bg-brand-pink/5 ring-1 ring-brand-pink/30"
                            : "hover:bg-gray-50"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:text-white transition ${COLOR_CLASSES[cat.color]
                              } ${isActive ? "text-white" : ""}`}
                          >
                            <i
                              className={`fa-solid ${cat.icon} text-xs sm:text-sm`}
                            />
                          </div>
                          <span
                            className={`font-medium transition text-sm sm:text-base ${isActive
                                ? "text-brand-pink"
                                : "text-brand-dark group-hover:text-brand-pink"
                              }`}
                          >
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-[10px] sm:text-xs text-brand-gray bg-gray-50 px-2 py-1 rounded-md">
                          {categoryCounts[cat.name] || 0} Articles
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

      {/* Modal */}
      {selectedBlog && (
        <BlogDetailModal
          blog={selectedBlog}
          onClose={() => setSelectedBlog(null)}
        />
      )}
    </>
  );
}



