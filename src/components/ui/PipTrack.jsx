/**
 * Dot / pip pagination track beneath the card.
 * Brilliant-style: green pill for active, small circles for rest.
 *
 * @param {{ cards: object[], currentIndex: number }} props
 */
export default function PipTrack({ cards, currentIndex }) {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
      {cards.map((card, i) => {
        const isActive = i === currentIndex;
        const isInteractive =
          card.type === "inflection" || card.type === "reflection";

        return (
          <div
            key={card.id}
            style={{
              width: isActive ? 22 : 7,
              height: 7,
              borderRadius: 100,
              background: isActive
                ? "var(--color-green-primary)"
                : isInteractive
                ? "#86efac" /* green-300 — marks interactive stops */
                : "var(--color-border-medium)",
              transition: "all 0.3s ease",
            }}
          />
        );
      })}
    </div>
  );
}
