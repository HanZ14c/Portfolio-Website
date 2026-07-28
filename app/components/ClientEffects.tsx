"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ClientEffects() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.dataset.ready = "true";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = reducedMotion
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.setAttribute("data-visible", "true");
                observer?.unobserve(entry.target);
              }
            });
          },
          { rootMargin: "0px 0px -8%", threshold: 0.08 },
        );

    const registerRevealElements = (root: Document | Element) => {
      const elements = [
        ...(root instanceof Element && root.matches("[data-reveal]") ? [root] : []),
        ...root.querySelectorAll("[data-reveal]"),
      ];

      elements.forEach((element) => {
        if (reducedMotion) {
          element.setAttribute("data-visible", "true");
        } else {
          observer?.observe(element);
        }
      });
    };

    registerRevealElements(document);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) registerRevealElements(node);
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
