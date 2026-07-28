"use client";

import { useEffect } from "react";

export function ClientEffects() {
  useEffect(() => {
    document.documentElement.dataset.ready = "true";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-reveal]").forEach((element) => {
        element.setAttribute("data-visible", "true");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );

    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return null;
}
