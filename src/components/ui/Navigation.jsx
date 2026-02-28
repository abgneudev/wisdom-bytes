import PipTrack from "./PipTrack";

/** Arrow button — light circular ghost button */
function NavButton({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: disabled ? "var(--color-surface-subtle)" : "var(--color-bg-card)",
        border: `1.5px solid ${disabled ? "var(--color-border-subtle)" : "var(--color-border-medium)"}`,
        color: disabled ? "var(--color-text-muted)" : "var(--color-text-secondary)",
        fontSize: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s",
        boxShadow: disabled ? "none" : "var(--shadow-card)",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = "var(--color-green-primary)";
          e.currentTarget.style.color = "var(--color-green-primary)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = "var(--color-border-medium)";
          e.currentTarget.style.color = "var(--color-text-secondary)";
        }
      }}
    >
      {children}
    </button>
  );
}

/**
 * Bottom navigation row: ← pip-track →
 */
export default function Navigation({
  cards,
  currentIndex,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        marginTop: 20,
      }}
    >
      <NavButton onClick={onPrev} disabled={!canGoPrev}>
        ←
      </NavButton>

      <PipTrack cards={cards} currentIndex={currentIndex} />

      <NavButton onClick={onNext} disabled={!canGoNext}>
        →
      </NavButton>
    </div>
  );
}
