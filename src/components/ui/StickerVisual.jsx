import { useStickerSearch } from "../../hooks/useStickerSearch";

/**
 * Renders a Klipy sticker if available, otherwise the emoji fallback.
 *
 * @param {{
 *   query: string | null | undefined,
 *   fallbackEmoji: string,
 *   size?: number,
 *   fill?: boolean,   // when true, sticker covers the full parent (position: absolute, inset: 0)
 * }} props
 */
export default function StickerVisual({ query, fallbackEmoji, size = 80, fill = false }) {
  const { stickerUrl, loading } = useStickerSearch(query);

  // ── Fill mode — sticker becomes a full-bleed illustration background ──
  if (fill) {
    if (stickerUrl) {
      return (
        <img
          src={stickerUrl}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.55,
            mixBlendMode: "multiply",
          }}
        />
      );
    }
    // Fallback: centered emoji when no sticker loaded yet
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 96,
          opacity: loading ? 0.2 : 1,
        }}
      >
        {fallbackEmoji}
      </div>
    );
  }

  // ── Inline mode (centred, fixed size) ──
  if (loading) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.3,
        }}
      >
        <div style={{ fontSize: size * 0.6 }}>{fallbackEmoji}</div>
      </div>
    );
  }

  if (stickerUrl) {
    return (
      <img
        src={stickerUrl}
        alt=""
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
        }}
      />
    );
  }

  return <div style={{ fontSize: size * 0.6 }}>{fallbackEmoji}</div>;
}
