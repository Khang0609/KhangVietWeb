"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const dotVisualRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Refs for GSAP quickTo functions for performance
  const dotXTo = useRef<gsap.QuickToFunc>(null);
  const dotYTo = useRef<gsap.QuickToFunc>(null);
  const ringXTo = useRef<gsap.QuickToFunc>(null);
  const ringYTo = useRef<gsap.QuickToFunc>(null);
  const glowXTo = useRef<gsap.QuickToFunc>(null);
  const glowYTo = useRef<gsap.QuickToFunc>(null);

  useEffect(() => {
    // Don't show custom cursor on touch devices
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      if (cursorDotRef.current) cursorDotRef.current.style.display = "none";
      if (cursorRingRef.current) cursorRingRef.current.style.display = "none";
      if (glowRef.current) glowRef.current.style.display = "none";
      return;
    } else {
      // Ensure cursor is visible on non-touch devices
      if (cursorDotRef.current) cursorDotRef.current.style.display = "block";
      if (cursorRingRef.current) cursorRingRef.current.style.display = "block";
      if (glowRef.current) glowRef.current.style.display = "block";
    }

    // Set initial positions to avoid a flash
    gsap.set([cursorDotRef.current, cursorRingRef.current, glowRef.current], {
      xPercent: -50,
      yPercent: -50,
    });

    // GSAP quickTo for smooth, performant animations
    dotXTo.current = gsap.quickTo(cursorDotRef.current, "x", {
      duration: 0.1,
      ease: "power3",
    });
    dotYTo.current = gsap.quickTo(cursorDotRef.current, "y", {
      duration: 0.1,
      ease: "power3",
    });
    ringXTo.current = gsap.quickTo(cursorRingRef.current, "x", {
      duration: 0.4,
      ease: "power3",
    });
    ringYTo.current = gsap.quickTo(cursorRingRef.current, "y", {
      duration: 0.4,
      ease: "power3",
    });
    glowXTo.current = gsap.quickTo(glowRef.current, "x", {
      duration: 0.5,
      ease: "power3",
    });
    glowYTo.current = gsap.quickTo(glowRef.current, "y", {
      duration: 0.5,
      ease: "power3",
    });

    const handleMouseMove = (e: MouseEvent) => {
      dotXTo.current?.(e.clientX);
      dotYTo.current?.(e.clientY);
      ringXTo.current?.(e.clientX);
      ringYTo.current?.(e.clientY);
      glowXTo.current?.(e.clientX);
      glowYTo.current?.(e.clientY);

      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        getComputedStyle(target).cursor === "pointer";

      if (isInteractive) {
        gsap.to(dotVisualRef.current, {
          scale: 1.5,
          width: "0.75rem",
          height: "0.75rem",
          backgroundColor: "#FF6B00",
          duration: 0.3,
        });
        if (cursorRingRef.current?.firstElementChild) {
          gsap.to(cursorRingRef.current.firstElementChild, {
            scale: 2,
            borderColor: "#FF6B00",
            borderWidth: "2px",
            width: "3rem",
            height: "3rem",
            duration: 0.3,
          });
        }
        gsap.to(glowRef.current, { scale: 1, opacity: 1, duration: 0.3 });
      } else {
        gsap.to(dotVisualRef.current, {
          scale: 1,
          width: "0.5rem",
          height: "0.5rem",
          backgroundColor: "white",
          duration: 0.3,
        });
        if (cursorRingRef.current?.firstElementChild) {
          gsap.to(cursorRingRef.current.firstElementChild, {
            scale: 1,
            borderColor: "rgba(255, 255, 255, 0.3)",
            borderWidth: "1px",
            width: "2rem",
            height: "2rem",
            duration: 0.3,
          });
        }
        gsap.to(glowRef.current, { scale: 0, opacity: 0, duration: 0.3 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Main Cursor Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
      >
        <div
          ref={dotVisualRef}
          className="w-2 h-2 rounded-full bg-white mix-blend-difference"
        ></div>
      </div>

      {/* Outer Glow Ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        ref={cursorRingRef}
      >
        <div className="w-8 h-8 rounded-full border border-white/30"></div>
      </div>

      {/* Glow Effect */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997] opacity-0"
      >
        <div className="w-20 h-20 rounded-full bg-[#FF6B00]/30 blur-xl"></div>
      </div>

      {/* Hide Default Cursor */}
      <style>{`
        body, a, button {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
