import { useState } from "react";

/**
 * Tracks swipe / drag gesture state for card navigation.
 *
 * @param {(dir: "next" | "prev") => void} goTo
 * @param {number} threshold   — minimum px drag to trigger navigation
 * @returns drag event handlers and current `dragX` offset
 */
export function useDragNavigation(goTo, threshold = 60) {
  const [touchStart, setTouchStart] = useState(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e) => {
    if (e.target.tagName === "TEXTAREA") return;
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (e.target.tagName === "TEXTAREA") return;
    if (touchStart !== null) setDragX(e.touches[0].clientX - touchStart);
  };

  const handleTouchEnd = () => {
    if (Math.abs(dragX) > threshold) {
      goTo(dragX < 0 ? "next" : "prev");
    }
    setTouchStart(null);
    setDragX(0);
    setIsDragging(false);
  };

  return { dragX, isDragging, handleTouchStart, handleTouchMove, handleTouchEnd };
}
