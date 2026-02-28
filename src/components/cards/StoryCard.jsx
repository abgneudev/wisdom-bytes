import Badge from "../ui/Badge";
import StickerVisual from "../ui/StickerVisual";

/**
 * Narrative story card.
 * Layout: fixed illustration zone (top) + scrollable body text (bottom).
 * No headline — visual + tradition badge carry the identity, body carries the story.
 *
 * @param {{ card: object }} props
 */
export default function StoryCard({ card }) {
  return (
    <>
      {/* ── Illustration zone (fixed height, tinted bg) ── */}
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
          gap: 14,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Soft radial glow behind sticker */}
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

        {/* Card visual — Klipy sticker or emoji fallback */}
        <div style={{ zIndex: 1 }}>
          <StickerVisual
            query={card.stickerQuery}
            fallbackEmoji={card.visual}
            size={120}
          />
        </div>

        {/* Tradition badge — bottom-left of illustration zone */}
        <div style={{ position: "absolute", bottom: 12, left: 16 }}>
          <Badge
            icon="◈"
            label={card.tradition ?? `Chapter ${card.id}`}
            accent={card.accent}
            bg={`${card.accent}18`}
          />
        </div>
      </div>

      {/* ── Body text (fills remaining height, scrollable) ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px var(--content-padding) 16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.8,
            color: "var(--color-text-secondary)",
            margin: 0,
            whiteSpace: "pre-line",
          }}
        >
          {card.body}
        </p>

        {/* Swipe hint */}
        <div
          style={{
            marginTop: 14,
            fontSize: 11,
            color: "var(--color-text-muted)",
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.05em",
          }}
        >
          swipe or use arrows →
        </div>
      </div>
    </>
  );
}
