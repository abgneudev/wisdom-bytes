import { useState } from "react";
import Badge from "../ui/Badge";
import StickerVisual from "../ui/StickerVisual";

/**
 * Inflection card — the "try first, learn after" moment.
 * Light-themed: warm cream background, green CTA (Brilliant-style).
 *
 * @param {{
 *   card: object,
 *   savedResponse: string | undefined,
 *   onSubmit: (key: string, value: string) => void,
 * }} props
 */
export default function InflectionCard({ card, savedResponse, onSubmit }) {
  const [inputValue, setInputValue] = useState("");
  const hasResponded = Boolean(savedResponse);
  const isReady = inputValue.trim().length > 0;

  const handleSubmit = () => {
    if (inputValue.trim()) onSubmit(card.inflectionKey, inputValue.trim());
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Illustration zone — same fixed height as story cards */}
      <div
        style={{
          height: "var(--illustration-height)",
          flexShrink: 0,
          background: card.accentBg,
          borderBottom: `1px solid ${card.accent}20`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${card.accent}22 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ zIndex: 1 }}>
          <StickerVisual
            query={card.stickerQuery}
            fallbackEmoji={card.visual}
            size={80}
          />
        </div>
        <div style={{ position: "absolute", bottom: 12, left: 16 }}>
          <Badge
            icon="✍️"
            label="Your Turn"
            accent={card.accent}
            bg={`${card.accent}18`}
          />
        </div>
      </div>

      {/* Content zone */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px var(--content-padding) 16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            fontSize: 14.5,
            lineHeight: 1.75,
            color: "var(--color-text-secondary)",
            margin: "0 0 18px",
            whiteSpace: "pre-line",
          }}
        >
          {card.prompt}
        </p>

      {/* Saved state — Brilliant green success block */}
      {hasResponded ? (
        <div
          style={{
            background: "var(--color-green-light)",
            border: "1px solid #bbf7d0",
            borderRadius: 12,
            padding: "16px 18px",
            marginBottom: 4,
          }}
          className="animate-pop-in"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 14 }}>✅</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--color-green-dark)",
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Response saved
            </span>
          </div>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "#166534",
              margin: "0 0 10px",
              fontStyle: "italic",
              paddingLeft: 12,
              borderLeft: "3px solid #22c55e",
            }}
          >
            &ldquo;{savedResponse}&rdquo;
          </p>
          <div
            style={{
              fontSize: 12,
              color: "var(--color-green-dark)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Continue to see what the traditions say →
          </div>
        </div>
      ) : (
        /* Input state */
        <div>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={card.placeholder}
            rows={4}
            style={{
              width: "100%",
              background: "#ffffff",
              border: `2px solid ${isReady ? "#22c55e" : "var(--color-border-medium)"}`,
              borderRadius: 12,
              padding: "14px 16px",
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-body)",
              boxSizing: "border-box",
              transition: "border-color var(--transition-fast)",
              boxShadow: isReady ? "0 0 0 3px rgba(34,197,94,0.12)" : "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#22c55e";
              e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.12)";
            }}
            onBlur={(e) => {
              if (!inputValue.trim()) {
                e.target.style.borderColor = "var(--color-border-medium)";
                e.target.style.boxShadow = "none";
              }
            }}
          />

          {/* Brilliant-style large green pill CTA */}
          <button
            onClick={handleSubmit}
            disabled={!isReady}
            style={{
              marginTop: 12,
              width: "100%",
              padding: "15px",
              borderRadius: 100,
              background: isReady ? "#22c55e" : "var(--color-border-subtle)",
              color: isReady ? "#ffffff" : "var(--color-text-muted)",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.01em",
              transition: "all 0.2s",
              boxShadow: isReady ? "var(--shadow-button)" : "none",
              transform: isReady ? "translateY(0)" : "none",
            }}
            onMouseEnter={(e) => {
              if (isReady) e.target.style.background = "#16a34a";
            }}
            onMouseLeave={(e) => {
              if (isReady) e.target.style.background = "#22c55e";
            }}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  </div>
  );
}
