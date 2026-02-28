import { useState, useCallback } from "react";

/**
 * Manages forward/backward card navigation with an animated slide direction.
 *
 * @param {number} totalCards
 * @param {(card: object) => boolean} canAdvanceFn — returns true when the
 *   current card allows forward navigation (e.g. inflection is answered)
 * @returns navigation state and `goTo` action
 */
export function useCardNavigation(totalCards, canAdvanceFn) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null); // "next" | "prev" | null

  const canGoNext = currentIndex < totalCards - 1 && canAdvanceFn(currentIndex);
  const canGoPrev = currentIndex > 0;

  const goTo = useCallback(
    (dir) => {
      if (dir === "next" && !canGoNext) return;
      if (dir === "prev" && !canGoPrev) return;

      setDirection(dir);
      setTimeout(() => {
        setCurrentIndex((i) => (dir === "next" ? i + 1 : i - 1));
        setDirection(null);
      }, 250);
    },
    [canGoNext, canGoPrev]
  );

  return { currentIndex, direction, canGoNext, canGoPrev, goTo };
}
