"use client";

import { useEffect } from "react";

/** Attaches IntersectionObserver to all .reveal / .reveal-scale elements under the ref.
 *  Re-scans on deps change so route changes reveal new content. */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible), .reveal-scale:not(.is-visible)")
    );
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
     
  }, deps);
}
