// "use client";

// import { useEffect, useState, useCallback } from "react";
// import Reveal from "./Reveal";
// import api from "@/axios";

// const formatDate = (dateStr) => {
//   if (!dateStr) return "";
//   try {
//     return new Date(dateStr).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   } catch {
//     return "";
//   }
// };

// const estimateReadTime = (content = "") => {
//   const words = content.trim().split(/\s+/).filter(Boolean).length;
//   const minutes = Math.max(1, Math.round(words / 200));
//   return `${minutes} min read`;
// };

// const normalizeBlog = (blog) => ({
//   id: blog.id,
//   tag: blog.category || "Lifestyle",
//   title: blog.title,
//   date: formatDate(blog.published_at || blog.created_at),
//   read: estimateReadTime(blog.content),
//   img:
//     blog.image ||
//     "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
//   excerpt: blog.excerpt || "",
// });

// function BlogDetailModal({ blog, onClose }) {
//   const [isVisible, setIsVisible] = useState(false);
//   const [isClosing, setIsClosing] = useState(false);

//   useEffect(() => {
//     requestAnimationFrame(() => setIsVisible(true));

//     const originalOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";

//     const handleKey = (e) => {
//       if (e.key === "Escape") handleClose();
//     };
//     window.addEventListener("keydown", handleKey);

//     return () => {
//       document.body.style.overflow = originalOverflow;
//       window.removeEventListener("keydown", handleKey);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleClose = () => {
//     setIsClosing(true);
//     setIsVisible(false);
//     setTimeout(() => onClose(), 350);
//   };

//   if (!blog) return null;
//   const active = isVisible && !isClosing;

//   return (
//     <div
//       className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"
//         }`}
//     >
//       {/* Backdrop */}
//       <div
//         onClick={handleClose}
//         className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md"
//       />

//       {/* Modal card */}
//       <div
//         className={`relative w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-500 ease-out ${active
//           ? "opacity-100 translate-y-0 scale-100"
//           : "opacity-0 translate-y-8 scale-95"
//           }`}
//       >
//         <button
//           onClick={handleClose}
//           aria-label="Close"
//           className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-brand-dark flex items-center justify-center shadow-lg hover:bg-brand-pink hover:text-white hover:rotate-90 transition-all duration-300"
//         >
//           <i className="fa-solid fa-xmark text-lg" />
//         </button>

//         <div className="overflow-y-auto max-h-[92vh] custom-scrollbar">
//           {/* Hero */}
//           <div className="relative h-56 sm:h-72 w-full overflow-hidden">
//             <img
//               src={blog.img}
//               alt={blog.tag}
//               className={`w-full h-full object-cover transition-transform duration-[1.2s] ease-out ${active ? "scale-100" : "scale-110"
//                 }`}
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

//             <span
//               className={`absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-brand-pink text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg transition-all duration-500 delay-150 ${active
//                 ? "opacity-100 translate-x-0"
//                 : "opacity-0 -translate-x-4"
//                 }`}
//             >
//               {blog.category}
//             </span>

//             <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
//               <h2
//                 className={`text-xl sm:text-3xl font-bold text-white leading-tight drop-shadow-lg transition-all duration-500 delay-200 ${active
//                   ? "opacity-100 translate-y-0"
//                   : "opacity-0 translate-y-4"
//                   }`}
//               >
//                 {blog.title}
//               </h2>
//             </div>
//           </div>

//           {/* Meta */}
//           <div
//             className={`flex flex-wrap items-center justify-between gap-4 px-5 sm:px-7 py-4 border-b border-gray-100 transition-all duration-500 delay-300 ${active
//               ? "opacity-100 translate-y-0"
//               : "opacity-0 translate-y-4"
//               }`}
//           >
//             <div className="flex items-center gap-3">
//               <img
//                 src={blog.date}
//                 alt={blog.read}
//                 className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-pink/20"
//               />
//               <div>
//                 <p className="text-sm font-semibold text-brand-dark">
//                   {blog.author_name}
//                 </p>
//                 <p className="text-xs text-brand-gray">{blog.meta}</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               {["fa-regular fa-heart", "fa-solid fa-share-nodes", "fa-regular fa-bookmark"].map(
//                 (icon) => (
//                   <button
//                     key={icon}
//                     className="w-9 h-9 rounded-full bg-brand-pink/10 text-brand-pink flex items-center justify-center hover:bg-brand-pink hover:text-white transition-all duration-300"
//                   >
//                     <i className={`${icon} text-sm`} />
//                   </button>
//                 )
//               )}
//             </div>
//           </div>

//           {/* Body */}
//           <div
//             className={`px-5 sm:px-7 py-6 transition-all duration-500 ${active
//               ? "opacity-100 translate-y-0"
//               : "opacity-0 translate-y-4"
//               }`}
//             style={{ transitionDelay: "400ms" }}
//           >
//             {blog.excerpt && (
//               <p className="text-brand-dark/80 text-base sm:text-lg font-medium italic border-l-4 border-brand-pink pl-4 mb-6">
//                 {blog.excerpt}
//               </p>
//             )}

//             {blog.content ? (
//               <div className="text-brand-gray leading-relaxed whitespace-pre-line text-sm sm:text-base">
//                 {blog.content}
//               </div>
//             ) : (
//               <p className="text-brand-gray text-sm">
//                 No content available for this article.
//               </p>
//             )}

//             <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
//               <div className="flex items-center gap-2 flex-wrap">
//                 <span className="text-xs text-brand-gray">Tags:</span>
//                 {[blog.category, "Story", "Inspiration"].map((tag) => (
//                   <span
//                     key={tag}
//                     className="text-xs font-medium bg-brand-pink/10 text-brand-pink px-3 py-1 rounded-full hover:bg-brand-pink hover:text-white transition-colors cursor-pointer"
//                   >
//                     #{tag}
//                   </span>
//                 ))}
//               </div>

//               <button
//                 onClick={handleClose}
//                 className="text-sm font-medium text-brand-pink hover:text-rose-600 transition flex items-center gap-2"
//               >
//                 Close article
//                 <i className="fa-solid fa-arrow-right text-xs" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #f9a8d4;
//           border-radius: 3px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #ec4899;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default function EditorsPicks() {
//   const [picks, setPicks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedBlog, setSelectedBlog] = useState(null);

//   const fetchBlogs = useCallback(async () => {
//     try {
//       setLoading(true);
//       const { data } = await api.get("/api/blog/allblogs");

//       const rawBlogs = Array.isArray(data)
//         ? data
//         : Array.isArray(data?.blogs)
//           ? data.blogs
//           : [];

//       // status "published" is mandatory
//       const publishedBlogs = rawBlogs
//         .filter((b) => b?.status === "published")
//         .map(normalizeBlog);

//       return publishedBlogs;
//     } catch (err) {
//       console.error("Failed to fetch blogs:", err?.message || err);
//       return [];
//     }
//   }, []);

//   useEffect(() => {
//     let isMounted = true;

//     (async () => {
//       const result = await fetchBlogs();
//       if (isMounted) {
//         setPicks(result.slice(0, 4)); // Take first 4 for editor's picks
//         setLoading(false);
//       }
//     })();

//     return () => {
//       isMounted = false;
//     };
//   }, [fetchBlogs]);

//   return (
//     <>
//       <section className="py-16 sm:py-20 bg-white w-full rounded-3xl mb-8">
//         <div className="px-4 sm:px-6 lg:px-8 w-full">
//           <Reveal className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10 gap-4">
//             <div>
//               <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-dark mb-2">
//                 Editor&apos;s Picks
//               </h2>
//               <p className="text-brand-gray text-sm sm:text-base">
//                 Handpicked stories you&apos;ll love
//               </p>
//             </div>
//             <div className="hidden sm:flex gap-2">
//               <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-brand-gray hover:border-brand-pink hover:text-brand-pink transition bg-white">
//                 <i className="fa-solid fa-arrow-left text-sm"></i>
//               </button>
//               <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-brand-gray hover:border-brand-pink hover:text-brand-pink transition bg-white">
//                 <i className="fa-solid fa-arrow-right text-sm"></i>
//               </button>
//             </div>
//           </Reveal>

//           <Reveal className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 no-scrollbar w-full">
//             {/* Loading skeleton */}
//             {loading &&
//               [0, 1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="min-w-[260px] sm:min-w-0 w-full animate-pulse"
//                 >
//                   <div className="rounded-2xl h-56 sm:h-64 mb-4 bg-gray-100" />
//                   <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
//                   <div className="h-3 bg-gray-100 rounded w-1/2" />
//                 </div>
//               ))}

//             {/* Empty state */}
//             {!loading && picks.length === 0 && (
//               <div className="sm:col-span-2 lg:col-span-4 bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center w-full">
//                 <div className="text-4xl text-brand-pink mb-3">
//                   <i className="fa-regular fa-face-frown"></i>
//                 </div>
//                 <h3 className="text-lg font-bold text-brand-dark mb-1">
//                   No articles found
//                 </h3>
//                 <p className="text-brand-gray text-sm">
//                   There are no published articles yet.
//                 </p>
//               </div>
//             )}

//             {/* Cards */}
//             {!loading &&
//               picks.map((pick) => (
//                 <article
//                   onClick={() => setSelectedBlog(pick)}
//                   key={pick.id || pick.title}
//                   className="min-w-[260px] sm:min-w-0 group cursor-pointer w-full"
//                 >
//                   <div className="relative overflow-hidden rounded-2xl h-56 sm:h-64 mb-4">
//                     <img
//                       src={pick.img}
//                       alt={pick.tag}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-pink text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
//                       {pick.tag}
//                     </span>
//                   </div>
//                   <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-brand-pink transition leading-snug">
//                     {pick.title}
//                   </h3>
//                   <div className="flex items-center gap-3 text-[10px] sm:text-xs text-brand-gray">
//                     <span>{pick.date}</span>
//                     <span className="w-1 h-1 rounded-full bg-gray-300"></span>
//                     <span>{pick.read}</span>
//                   </div>
//                 </article>
//               ))}
//           </Reveal>
//         </div>
//       </section>
      
//     </>

//   );
// }




"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  content: blog.content || "",
  author_name: blog.author_name || "Editorial Team",
  category: blog.category || "Lifestyle",
});

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
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 transition-opacity duration-300 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md"
      />

      <div
        className={`relative w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-500 ease-out ${
          active
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
          <div className="relative h-56 sm:h-72 w-full overflow-hidden">
            <img
              src={blog.img}
              alt={blog.tag}
              className={`w-full h-full object-cover transition-transform duration-[1.2s] ease-out ${
                active ? "scale-100" : "scale-110"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <span
              className={`absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-brand-pink text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg transition-all duration-500 delay-150 ${
                active
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
              }`}
            >
              {blog.category}
            </span>

            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <h2
                className={`text-xl sm:text-3xl font-bold text-white leading-tight drop-shadow-lg transition-all duration-500 delay-200 ${
                  active
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                {blog.title}
              </h2>
            </div>
          </div>

          <div
            className={`flex flex-wrap items-center justify-between gap-4 px-5 sm:px-7 py-4 border-b border-gray-100 transition-all duration-500 delay-300 ${
              active
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-pink/20 flex items-center justify-center ring-2 ring-brand-pink/20">
                <i className="fa-solid fa-user text-brand-pink text-sm" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-dark">
                  {blog.author_name}
                </p>
                <p className="text-xs text-brand-gray">
                  {blog.date} · {blog.read}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[
                "fa-regular fa-heart",
                "fa-solid fa-share-nodes",
                "fa-regular fa-bookmark",
              ].map((icon) => (
                <button
                  key={icon}
                  className="w-9 h-9 rounded-full bg-brand-pink/10 text-brand-pink flex items-center justify-center hover:bg-brand-pink hover:text-white transition-all duration-300"
                >
                  <i className={`${icon} text-sm`} />
                </button>
              ))}
            </div>
          </div>

          <div
            className={`px-5 sm:px-7 py-6 transition-all duration-500 ${
              active
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

export default function EditorsPicks() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const trackRef = useRef(null);
  const sliderWrapRef = useRef(null);

  // Mutable animation state kept in refs to avoid re-renders
  const positionRef = useRef(0);
  const targetPositionRef = useRef(0);
  const isPausedRef = useRef(false);
  const isUserInteractingRef = useRef(false);
  const rafIdRef = useRef(null);
  const pauseTimerRef = useRef(null);
  const cardsReadyRef = useRef(false);

  /* ============================================================
     FETCH BLOGS
     ============================================================ */
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/blog/allblogs");

      const rawBlogs = Array.isArray(data)
        ? data
        : Array.isArray(data?.blogs)
        ? data.blogs
        : [];

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
        setPicks(result);
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [fetchBlogs]);

  /* ============================================================
     HELPERS
     ============================================================ */
  const getStepSize = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 324;
    const firstCard = track.querySelector(".ep-card");
    if (!firstCard) return 324;
    const rect = firstCard.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    return rect.width + gap;
  }, []);

  const temporarilyPause = useCallback(() => {
    isPausedRef.current = true;
    clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 2500);
  }, []);

  const slideNext = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = getStepSize();
    const half = track.scrollWidth / 2;

    targetPositionRef.current = positionRef.current - step;

    if (targetPositionRef.current <= -half) {
      targetPositionRef.current += half;
      positionRef.current += half;
    }
    isUserInteractingRef.current = true;
  }, [getStepSize]);

  const slidePrev = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = getStepSize();
    const half = track.scrollWidth / 2;

    targetPositionRef.current = positionRef.current + step;

    if (targetPositionRef.current > 0) {
      targetPositionRef.current -= half;
      positionRef.current -= half;
    }
    isUserInteractingRef.current = true;
  }, [getStepSize]);

  /* ============================================================
     ANIMATION LOOP
     ============================================================ */
  useEffect(() => {
    if (loading || picks.length === 0) return;

    const track = trackRef.current;
    const wrap = sliderWrapRef.current;
    if (!track || !wrap) return;

    cardsReadyRef.current = true;
    positionRef.current = 0;
    targetPositionRef.current = 0;
    track.style.transform = "translateX(0px)";

    const autoSpeed = 0.6;

    const animate = () => {
      const half = track.scrollWidth / 2;

      if (isUserInteractingRef.current) {
        const diff = targetPositionRef.current - positionRef.current;
        if (Math.abs(diff) < 0.5) {
          positionRef.current = targetPositionRef.current;
          isUserInteractingRef.current = false;
        } else {
          positionRef.current += diff * 0.12;
        }
      } else if (!isPausedRef.current && half > 0) {
        positionRef.current -= autoSpeed;
        targetPositionRef.current = positionRef.current;

        if (positionRef.current <= -half) {
          positionRef.current += half;
          targetPositionRef.current = positionRef.current;
        }
        if (positionRef.current > 0) {
          positionRef.current -= half;
          targetPositionRef.current = positionRef.current;
        }
      }

      track.style.transform = `translateX(${positionRef.current}px)`;
      rafIdRef.current = requestAnimationFrame(animate);
    };

    // Pause handlers
    const onEnter = () => (isPausedRef.current = true);
    const onLeave = () => (isPausedRef.current = false);
    const onTouchStart = () => (isPausedRef.current = true);
    const onTouchEnd = () => (isPausedRef.current = false);

    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);
    wrap.addEventListener("touchstart", onTouchStart, { passive: true });
    wrap.addEventListener("touchend", onTouchEnd, { passive: true });

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      clearTimeout(pauseTimerRef.current);
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      wrap.removeEventListener("touchstart", onTouchStart);
      wrap.removeEventListener("touchend", onTouchEnd);
      cardsReadyRef.current = false;
    };
  }, [loading, picks]);

  const handlePrevClick = () => {
    slidePrev();
    temporarilyPause();
  };

  const handleNextClick = () => {
    slideNext();
    temporarilyPause();
  };

  // Duplicate cards for seamless infinite loop
  const duplicatedPicks = picks.length > 0 ? [...picks, ...picks] : [];

  return (
    <>
      <section className="py-16 sm:py-20 bg-white w-full rounded-3xl mb-8 overflow-hidden">
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
            <div className="flex gap-2">
              <button
                onClick={handlePrevClick}
                aria-label="Previous"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-brand-gray hover:border-brand-pink hover:text-brand-pink transition bg-white hover:scale-110 active:scale-95"
              >
                <i className="fa-solid fa-arrow-left text-sm" />
              </button>
              <button
                onClick={handleNextClick}
                aria-label="Next"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-brand-gray hover:border-brand-pink hover:text-brand-pink transition bg-white hover:scale-110 active:scale-95"
              >
                <i className="fa-solid fa-arrow-right text-sm" />
              </button>
            </div>
          </Reveal>

          {/* Loading skeleton */}
          {loading && (
            <div className="flex gap-6 pb-6 overflow-hidden">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="min-w-[260px] sm:min-w-[300px] max-w-[300px] flex-shrink-0 animate-pulse"
                >
                  <div className="rounded-2xl h-56 sm:h-60 mb-4 bg-gray-100" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && picks.length === 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center w-full">
              <div className="text-4xl text-brand-pink mb-3">
                <i className="fa-regular fa-face-frown" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-1">
                No articles found
              </h3>
              <p className="text-brand-gray text-sm">
                There are no published articles yet.
              </p>
            </div>
          )}

          {/* Infinite Slider */}
          {!loading && picks.length > 0 && (
            <div ref={sliderWrapRef} className="relative w-full">
              <div className="ep-viewport overflow-hidden w-full">
                <div
                  ref={trackRef}
                  className="flex gap-6 will-change-transform"
                  style={{ width: "max-content" }}
                >
                  {duplicatedPicks.map((pick, index) => (
                    <article
                      onClick={() => setSelectedBlog(pick)}
                      key={`${pick.id || pick.title}-${index}`}
                      className="ep-card group cursor-pointer flex-shrink-0 min-w-[260px] sm:min-w-[300px] max-w-[300px]"
                    >
                      <div className="relative overflow-hidden rounded-2xl h-56 sm:h-60 mb-4 shadow-md group-hover:shadow-2xl group-hover:shadow-brand-pink/25 group-hover:-translate-y-1 transition-all duration-500">
                        <img
                          src={pick.img}
                          alt={pick.tag}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* Category tag */}
                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-pink text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider transform transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-pink group-hover:text-white shadow-lg z-[2]">
                          {pick.tag}
                        </span>

                        {/* Hover overlay meta */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex items-center gap-2 text-white text-xs z-[2]">
                          <i className="fa-regular fa-clock" />
                          <span>{pick.read}</span>
                          <span className="w-1 h-1 rounded-full bg-white/60" />
                          <span>{pick.date}</span>
                        </div>

                        {/* Shine sweep */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none z-[3]" />
                      </div>

                      <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-brand-pink transition-colors duration-300 leading-snug ep-line-clamp-2 min-h-[2.9rem]">
                        {pick.title}
                      </h3>

                      <div className="flex items-center justify-between gap-3 text-[10px] sm:text-xs text-brand-gray">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span>{pick.date}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span>{pick.read}</span>
                        </div>
                        <span className="text-brand-pink font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 whitespace-nowrap">
                          Read More
                          <i className="fa-solid fa-arrow-right text-[9px] transform group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedBlog && (
        <BlogDetailModal
          blog={selectedBlog}
          onClose={() => setSelectedBlog(null)}
        />
      )}

      <style jsx global>{`
        /* Fade edges on slider viewport */
        .ep-viewport {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            #000 6%,
            #000 94%,
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            #000 6%,
            #000 94%,
            transparent
          );
        }

        /* Two-line clamp for card titles */
        .ep-line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Custom scrollbar for modal */
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
    </>
  );
}