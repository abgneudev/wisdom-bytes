/**
 * CardShell — the styled outer container shared by all card types.
 * Light-themed: white card with subtle shadow, colored accent top-strip.
 *
 * @param {{
 *   card: object,
 *   direction: "next" | "prev" | null,
 *   dragX: number,
 *   isDragging: boolean,
 *   isInflection: boolean,
 *   onTouchStart: Function,
 *   onTouchMove: Function,
 *   onTouchEnd: Function,
 *   children: React.ReactNode,
 * }} props
 */
export default function CardShell({
  card,
  direction,
  dragX,
  isDragging,
  isInflection,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  children,
}) {
  const transform = isDragging
    ? `translateX(${dragX * 0.4}px) rotate(${dragX * 0.02}deg)`
    : direction === "next"
    ? "translateX(-120%) rotate(-4deg)"
    : direction === "prev"
    ? "translateX(120%) rotate(4deg)"
    : "translateX(0)";

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        width: "100%",
        maxWidth: "var(--card-max-width)",
        height: "var(--card-height)",   /* fixed — never grows with content */
        background: card.bg,
        borderRadius: "var(--card-radius)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        transform,
        opacity: direction ? 0 : 1,
        transition: isDragging ? "none" : `all var(--transition-slide)`,
        cursor: isInflection || card.type === "reflection" ? "default" : "grab",
        boxShadow: "var(--shadow-card)",
        border: `1px solid var(--color-border-subtle)`,
      }}
    >
      {children}
    </div>
  );
}
