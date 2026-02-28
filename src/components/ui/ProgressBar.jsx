/**
 * Brilliant-style progress bar: vivid green fill on a light gray track.
 * Positioned at the top of the lesson, full width.
 *
 * @param {{ progress: number, accentColor?: string }} props
 */
export default function ProgressBar({ progress, accentColor }) {
  const fill = accentColor ?? "var(--color-green-primary)";
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "var(--card-max-width)",
        height: 6,
        background: "var(--color-border-subtle)",
        borderRadius: 100,
        marginBottom: 18,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: fill,
          borderRadius: 100,
          transition: `width var(--transition-color)`,
        }}
      />
    </div>
  );
}
