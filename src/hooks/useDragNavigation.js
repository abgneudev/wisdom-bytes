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
  const [touchStartY, setTouchStartY] = useState(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHorizontalGesture, setIsHorizontalGesture] = useState(false);

  const handleTouchStart = (e) => {
    if (e.target.tagName === "TEXTAREA") return;
    setTouchStart(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setIsDragging(false);
    setIsHorizontalGesture(false);
  };

  const handleTouchMove = (e) => {
    if (e.target.tagName === "TEXTAREA") return;
    if (touchStart === null || touchStartY === null) return;

    const deltaX = e.touches[0].clientX - touchStart;
    const deltaY = e.touches[0].clientY - touchStartY;

    if (!isHorizontalGesture) {
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;
      setIsHorizontalGesture(true);
      setIsDragging(true);
    }

    setDragX(deltaX);
  };

  const handleTouchEnd = () => {
    if (isHorizontalGesture && Math.abs(dragX) > threshold) {
      goTo(dragX < 0 ? "next" : "prev");
    }

    setTouchStart(null);
    setTouchStartY(null);
    setDragX(0);
    setIsDragging(false);
    setIsHorizontalGesture(false);
  };

  return { dragX, isDragging, handleTouchStart, handleTouchMove, handleTouchEnd };
}
