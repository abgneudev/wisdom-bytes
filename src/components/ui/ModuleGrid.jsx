import { ALL_MODULES } from "../../data/modules/index";

const CATEGORY_COLORS = {
  Friendship:  { bg: "#eef2ff", text: "#4338ca" },
  Purpose:     { bg: "#fff7ed", text: "#c2410c" },
  "Inner Peace": { bg: "#f0fdf4", text: "#15803d" },
  "Self-Worth": { bg: "#fdf2f8", text: "#be185d" },
  Courage:     { bg: "#fffbeb", text: "#b45309" },
  Healing:     { bg: "#f5f3ff", text: "#7c3aed" },
  Clarity:     { bg: "#f0f9ff", text: "#0369a1" },
}

export default function ModuleGrid() {
    return <>
        <h1>Placeholder</h1>
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
    </>
}