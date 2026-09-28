"use client";

import useScrollReveal from "@/hooks/useScrollReveal";

export default function Reveal({ children, className = "", as: Tag = "div" }) {
  const ref = useScrollReveal();
  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
