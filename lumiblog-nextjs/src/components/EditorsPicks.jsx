"use client";

import { useEffect, useState, useCallback } from "react";
import Reveal from "./Reveal";
import api from "@/axios";

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
  tag: blog.category || "Lifestyle",
  title: blog.title,
  date: formatDate(blog.published_at || blog.created_at),
  read: estimateReadTime(blog.content),
  img:
    blog.image ||
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
  excerpt: blog.excerpt || "",
});

export default function EditorsPicks() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/blog/allblogs");

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
      const result = await fetchBlogs();
      if (isMounted) {
        setPicks(result.slice(0, 4)); // Take first 4 for editor's picks
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [fetchBlogs]);

  return (
    <section className="py-16 sm:py-20 bg-white w-full rounded-3xl mb-8">
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        <Reveal className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-dark mb-2">
              Editor&apos;s Picks
            </h2>
            <p className="text-brand-gray text-sm sm:text-base">
              Handpicked stories you&apos;ll love
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-brand-gray hover:border-brand-pink hover:text-brand-pink transition bg-white">
              <i className="fa-solid fa-arrow-left text-sm"></i>
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-brand-gray hover:border-brand-pink hover:text-brand-pink transition bg-white">
              <i className="fa-solid fa-arrow-right text-sm"></i>
            </button>
          </div>
        </Reveal>

        <Reveal className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 no-scrollbar w-full">
          {/* Loading skeleton */}
          {loading &&
            [0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-w-[260px] sm:min-w-0 w-full animate-pulse"
              >
                <div className="rounded-2xl h-56 sm:h-64 mb-4 bg-gray-100" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}

          {/* Empty state */}
          {!loading && picks.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-4 bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center w-full">
              <div className="text-4xl text-brand-pink mb-3">
                <i className="fa-regular fa-face-frown"></i>
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-1">
                No articles found
              </h3>
              <p className="text-brand-gray text-sm">
                There are no published articles yet.
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading &&
            picks.map((pick) => (
              <article
                key={pick.id || pick.title}
                className="min-w-[260px] sm:min-w-0 group cursor-pointer w-full"
              >
                <div className="relative overflow-hidden rounded-2xl h-56 sm:h-64 mb-4">
                  <img
                    src={pick.img}
                    alt={pick.tag}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-pink text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {pick.tag}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-brand-pink transition leading-snug">
                  {pick.title}
                </h3>
                <div className="flex items-center gap-3 text-[10px] sm:text-xs text-brand-gray">
                  <span>{pick.date}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>{pick.read}</span>
                </div>
              </article>
            ))}
        </Reveal>
      </div>
    </section>
  );
}