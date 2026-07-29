"use client";

import { useEffect, useRef, useState } from "react";

type CueMode = "down" | "top";

export function HomeScrollCue() {
  const [mode, setMode] = useState<CueMode>("down");
  const [isVisible, setIsVisible] = useState(false);
  const hasScrolled = useRef(false);

  useEffect(() => {
    const updateCue = () => {
      const scrollTop = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      const isAtBottom = scrollTop + window.innerHeight >= pageHeight - 12;

      if (scrollTop > 8) hasScrolled.current = true;

      if (isAtBottom && pageHeight > window.innerHeight + 32) {
        setMode("top");
        setIsVisible(true);
      } else if (hasScrolled.current) {
        setIsVisible(false);
      }
    };

    const revealTimer = window.setTimeout(() => {
      if (!hasScrolled.current && window.scrollY <= 8) {
        setMode("down");
        setIsVisible(true);
      }
    }, 1000);

    updateCue();
    window.addEventListener("scroll", updateCue, { passive: true });
    window.addEventListener("resize", updateCue);

    return () => {
      window.clearTimeout(revealTimer);
      window.removeEventListener("scroll", updateCue);
      window.removeEventListener("resize", updateCue);
    };
  }, []);

  const scrollDown = () => {
    hasScrolled.current = true;
    window.scrollBy({
      top: window.innerHeight * 0.82,
      behavior: "smooth",
    });
    window.requestAnimationFrame(() => setIsVisible(false));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.requestAnimationFrame(() => setIsVisible(false));
  };

  const isDownCue = mode === "down";

  return (
    <button
      className={`scroll-cue scroll-cue--${mode}${isVisible ? " is-visible" : ""}`}
      type="button"
      onClick={isDownCue ? scrollDown : scrollToTop}
      aria-label={isDownCue ? "Scroll to explore" : "Back to top"}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      title={isDownCue ? "Scroll to explore" : "Back to top"}
    >
      <span className="scroll-cue__icon" aria-hidden="true">{isDownCue ? "↓" : "↑"}</span>
    </button>
  );
}
