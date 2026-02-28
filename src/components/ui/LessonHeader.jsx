/**
 * Top-of-screen lesson header: module tag, lesson title, and card counter.
 * Matches Brilliant's minimal top bar: X button area + progress context.
 *
 * @param {{ title: string, module: string, current: number, total: number }} props
 */
export default function LessonHeader({ title, module, current, total }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "var(--card-max-width)",
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.12em",
            color: "var(--color-text-tertiary)",
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            marginBottom: 2,
          }}
        >
          {module}
        </div>
        <div
          style={{
            fontSize: 15,
            color: "var(--color-text-primary)",
            fontWeight: 600,
            fontFamily: "var(--font-display)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          fontSize: 12,
          color: "var(--color-text-tertiary)",
          fontFamily: "var(--font-mono)",
          flexShrink: 0,
        }}
      >
        {current}/{total}
      </div>
    </div>
  );
}
