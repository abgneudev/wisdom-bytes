import { useState } from "react";

import { ALL_MODULES } from "../data/modules/index";
import ModuleGrid from "./ui/ModuleGrid.jsx";

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
 * @param {{
 *   onSelect: (module: object) => void,
 *   onGenerate: (prompt: string) => Promise<void>,
 *   isGenerating: boolean,
 *   generationError: string,
 * }} props
 */
export default function HomeScreen({
  onSelect,
  onGenerate,
  isGenerating,
  generationError,
}) {
  const [prompt, setPrompt] = useState("");
  const PROMPT_MAX = 500;
  const hasPrompt = prompt.trim().length > 0;

  const handleGenerateClick = () => {
    if (!hasPrompt || isGenerating) return;
    onGenerate(prompt.trim());
  };

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
        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: 16,
            padding: 16,
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
              gap: 12,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 15,
                color: "var(--color-text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              Generate your own story
            </h2>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--color-green-dark)",
                background: "var(--color-green-light)",
                borderRadius: 100,
                padding: "3px 8px",
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                flexShrink: 0,
              }}
            >
              Real-time
            </span>
          </div>

          <p
            style={{
              margin: "0 0 10px",
              fontSize: 13,
              color: "var(--color-text-secondary)",
              lineHeight: 1.5,
            }}
          >
            Describe what you're going through. The lesson will be generated with
            story chapters, inflection pauses, and a final reflection.
          </p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, PROMPT_MAX))}
            placeholder="Ex: I keep overthinking every decision and feel stuck between options."
            maxLength={PROMPT_MAX}
            rows={4}
            style={{
              width: "100%",
              resize: "vertical",
              boxSizing: "border-box",
              borderRadius: 12,
              border: `1px solid ${hasPrompt ? "var(--color-border-accent)" : "var(--color-border-medium)"}`,
              padding: "12px 14px",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--color-text-primary)",
              background: "#ffffff",
              lineHeight: 1.55,
              marginBottom: 10,
              outline: "none",
            }}
          />

          {generationError && (
            <p
              style={{
                margin: "0 0 10px",
                fontSize: 12,
                color: "var(--color-text-secondary)",
              }}
            >
              {generationError}
            </p>
          )}

          <button
            onClick={handleGenerateClick}
            disabled={!hasPrompt || isGenerating}
            style={{
              width: "100%",
              border: "none",
              borderRadius: 100,
              padding: "12px 16px",
              cursor: !hasPrompt || isGenerating ? "not-allowed" : "pointer",
              background:
                !hasPrompt || isGenerating
                  ? "var(--color-border-subtle)"
                  : "var(--color-green-primary)",
              color: !hasPrompt || isGenerating ? "var(--color-text-muted)" : "#ffffff",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              boxShadow:
                !hasPrompt || isGenerating ? "none" : "var(--shadow-button)",
            }}
          >
            {isGenerating ? "Generating your lesson..." : "Generate story"}
          </button>
        </div>

        <ModuleGrid/>
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
