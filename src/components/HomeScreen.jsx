import { ALL_MODULES } from "../data/modules/index";

const CATEGORY_COLORS = {
  Friendship:  { bg: "#eef2ff", text: "#4338ca" },
  Purpose:     { bg: "#fff7ed", text: "#c2410c" },
  "Inner Peace": { bg: "#f0fdf4", text: "#15803d" },
  "Self-Worth": { bg: "#fdf2f8", text: "#be185d" },
  Courage:     { bg: "#fffbeb", text: "#b45309" },
  Healing:     { bg: "#f5f3ff", text: "#7c3aed" },
  Clarity:     { bg: "#f0f9ff", text: "#0369a1" },
};

/**
 * Library home screen — shows all available modules as a card grid.
 * @param {{ onSelect: (module: object) => void }} props
 */
export default function HomeScreen({ onSelect }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--color-bg-app)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-display)",
      }}
    >
      {/* ── Top bar ── */}
      <header
        style={{
          padding: "24px 24px 0",
          maxWidth: 600,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 100,
            padding: "4px 12px",
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 12 }}>🌿</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#15803d",
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Mindful Library
          </span>
        </div>

        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "var(--color-text-primary)",
            letterSpacing: "-0.03em",
            margin: "0 0 6px",
            lineHeight: 1.2,
          }}
        >
          Stories that think with you
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--color-text-secondary)",
            margin: "0 0 28px",
            lineHeight: 1.6,
          }}
        >
          Each parable draws on six wisdom traditions to help you see
          your own life more clearly.
        </p>
      </header>

      {/* ── Module grid ── */}
      <main
        style={{
          flex: 1,
          padding: "0 16px 40px",
          maxWidth: 600,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {ALL_MODULES.map((mod) => {
          const cat = CATEGORY_COLORS[mod.category] || {
            bg: "#f8fafc",
            text: "#475569",
          };
          const storyCount = mod.cards.filter((c) => c.type === "story").length;
          const inflectionCount = mod.cards.filter((c) => c.type === "inflection").length;

          return (
            <button
              key={mod.id}
              onClick={() => onSelect(mod)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: "#ffffff",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: 16,
                padding: "16px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.18s",
                boxShadow: "var(--shadow-card)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "var(--shadow-card-hover)";
                e.currentTarget.style.borderColor = mod.accentColor + "44";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-card)";
                e.currentTarget.style.borderColor = "var(--color-border-subtle)";
              }}
            >
              {/* Icon block */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: mod.accentColor + "14",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  flexShrink: 0,
                }}
              >
                {mod.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: cat.text,
                      background: cat.bg,
                      borderRadius: 100,
                      padding: "2px 8px",
                      fontFamily: "var(--font-mono)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {mod.category}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                    letterSpacing: "-0.02em",
                    marginBottom: 2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {mod.title}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "var(--color-text-tertiary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {storyCount} stories · {inflectionCount} reflections
                </div>
              </div>

              {/* Arrow */}
              <div
                style={{
                  fontSize: 18,
                  color: "var(--color-text-muted)",
                  flexShrink: 0,
                }}
              >
                →
              </div>
            </button>
          );
        })}
      </main>
    </div>
  );
}
