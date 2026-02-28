/**
 * Pill badge — small labelled chip shown at the top of each card.
 * Light-themed: solid tinted bg, dark accent text.
 *
 * @param {{ icon: string, label: string, accent: string, bg?: string }} props
 */
export default function Badge({ icon, label, accent, bg }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 10px",
        borderRadius: 100,
        background: bg ?? "#f1f5f9",
        marginBottom: 10,
      }}
    >
      <span style={{ fontSize: 10 }}>{icon}</span>
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.12em",
          color: accent,
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        {label}
      </span>
    </div>
  );
}
