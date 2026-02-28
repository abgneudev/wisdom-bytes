import { useState, useEffect } from "react";

/**
 * Animated ellipsis for loading states.
 * Cycles through ".", "..", "..." every 500 ms.
 */
export default function LoadingDots() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
      {dots}
    </span>
  );
}
