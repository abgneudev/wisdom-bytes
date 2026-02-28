import Badge from "../ui/Badge";
import LoadingDots from "../ui/LoadingDots";

/** Spinner — Brilliant-style green ring */
function Spinner() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 0",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "3px solid var(--color-border-subtle)",
          borderTopColor: "var(--color-green-primary)",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <div
        style={{
          fontSize: 13,
          color: "var(--color-text-tertiary)",
          fontFamily: "var(--font-mono)",
        }}
      >
        reflecting<LoadingDots />
      </div>
    </div>
  );
}

/** Error state */
function ErrorState({ onRetry }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 12,
        background: "#fef2f2",
        border: "1px solid #fecaca",
        textAlign: "center",
        marginBottom: 16,
      }}
    >
      <p style={{ fontSize: 14, color: "#991b1b", margin: "0 0 12px" }}>
        The mirror is clouded right now. Let's try again.
      </p>
      <button
        onClick={onRetry}
        style={{
          padding: "10px 28px",
          borderRadius: 100,
          border: "none",
          background: "var(--color-green-primary)",
          color: "#fff",
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "var(--font-display)",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}

/** One reflection entry — learner quote + AI interpretation */
function ReflectionEntry({ contextKey, ctx, response, reflection }) {
  return (
    <div
      key={contextKey}
      className="animate-slide-up"
      style={{
        marginBottom: 16,
        borderRadius: 12,
        border: "1px solid var(--color-border-subtle)",
        overflow: "hidden",
      }}
    >
      {/* Label bar */}
      <div
        style={{
          padding: "8px 16px",
          background: "var(--color-surface-subtle)",
          borderBottom: "1px solid var(--color-border-subtle)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "var(--color-green-dark)",
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
        }}
      >
        {ctx.label}
      </div>

      <div style={{ padding: "14px 16px" }}>
        {/* Learner's words */}
        {response ? (
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--color-text-secondary)",
              margin: "0 0 12px",
              fontStyle: "italic",
              paddingLeft: 12,
              borderLeft: "3px solid var(--color-green-primary)",
            }}
          >
            &ldquo;{response}&rdquo;
          </p>
        ) : (
          <p
            style={{
              fontSize: 13,
              color: "var(--color-text-muted)",
              margin: "0 0 12px",
              fontStyle: "italic",
            }}
          >
            (skipped)
          </p>
        )}

        {/* AI reflection */}
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--color-text-secondary)",
            margin: 0,
          }}
        >
          {reflection}
        </p>
      </div>
    </div>
  );
}

/**
 * AI-powered reflection card.
 *
 * @param {{
 *   responses: Record<string, string>,
 *   reflections: Record<string, string> | null,
 *   inflectionContext: Record<string, { label: string, storyContext: string }>,
 *   isLoading: boolean,
 *   hasError: boolean,
 *   onRetry: () => void,
 * }} props
 */
export default function ReflectionCard({
  responses,
  reflections,
  inflectionContext,
  isLoading,
  hasError,
  onRetry,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Illustration zone */}
      <div
        style={{
          height: "var(--illustration-height)",
          flexShrink: 0,
          background: "#f0fdf4",
          borderBottom: "1px solid #bbf7d0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ fontSize: 80, lineHeight: 1, zIndex: 1 }}>🪞</div>
        <div style={{ position: "absolute", bottom: 12, left: 16 }}>
          <Badge
            icon="🪞"
            label="Reflection"
            accent="var(--color-green-dark)"
            bg="#dcfce7"
          />
        </div>
      </div>

      {/* Scrollable content zone */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px var(--content-padding)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: "var(--color-text-tertiary)",
            margin: "0 0 14px",
            lineHeight: 1.5,
          }}
        >
          {isLoading
            ? "Reading your responses and reflecting..."
            : "Here's what you said — and what the story sees in your words."}
        </p>

      {isLoading && <Spinner />}
      {hasError && !isLoading && <ErrorState onRetry={onRetry} />}

      {reflections &&
        !isLoading &&
        Object.entries(inflectionContext).map(([key, ctx]) => (
          <ReflectionEntry
            key={key}
            contextKey={key}
            ctx={ctx}
            response={responses[key]}
            reflection={reflections[key]}
          />
        ))}
    </div>
  </div>
  );
}
