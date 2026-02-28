import { useState, useCallback, useEffect } from "react";

import { useCardNavigation } from "../hooks/useCardNavigation";
import { useDragNavigation } from "../hooks/useDragNavigation";
import { useReflections } from "../hooks/useReflections";
import { preloadStickers } from "../hooks/useStickerSearch";

import LessonHeader from "./ui/LessonHeader";
import ProgressBar from "./ui/ProgressBar";
import Navigation from "./ui/Navigation";

import CardShell from "./cards/CardShell";
import StoryCard from "./cards/StoryCard";
import InflectionCard from "./cards/InflectionCard";
import ReflectionCard from "./cards/ReflectionCard";

/**
 * The full lesson experience for a single module.
 *
 * @param {{
 *   module: import('../data/modules/index').Module,
 *   onBack: () => void,
 * }} props
 */
export default function LessonView({ module, onBack }) {
  const { cards, inflectionContext, title, subtitle, category } = module;

  /** Collected learner responses keyed by inflectionKey — reset each module */
  const [responses, setResponses] = useState({});

  // ── Preload stickers for current module ───────────────────
  useEffect(() => {
    preloadStickers(cards);
  }, [cards]);

  // ── Navigation ────────────────────────────────────────────
  const canAdvance = useCallback(
    (index) => {
      const card = cards[index];
      if (card.type === "inflection") return Boolean(responses[card.inflectionKey]);
      return true;
    },
    [cards, responses]
  );

  const { currentIndex, direction, canGoNext, canGoPrev, goTo } =
    useCardNavigation(cards.length, canAdvance);

  const card = cards[currentIndex];
  const isInflection = card.type === "inflection";
  const isReflection = card.type === "reflection";

  // ── Drag / swipe ──────────────────────────────────────────
  const { dragX, isDragging, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useDragNavigation(goTo);

  // ── AI Reflections ─────────────────────────────────────────
  const { reflections, isLoading, hasError, retry } = useReflections(
    isReflection,
    responses,
    inflectionContext,
    { title, subtitle }
  );

  // ── Derived values ─────────────────────────────────────────
  const progress = ((currentIndex + 1) / cards.length) * 100;

  // ── Handlers ──────────────────────────────────────────────
  const handleInflectionSubmit = useCallback((key, value) => {
    setResponses((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--color-bg-app)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        userSelect: "none",
      }}
    >
      {/* ── Back + Header ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "var(--card-max-width)",
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          marginBottom: 4,
        }}
      >
        <button
          onClick={onBack}
          title="Back to library"
          style={{
            padding: "6px 10px",
            borderRadius: 100,
            background: "#ffffff",
            border: "1px solid var(--color-border-subtle)",
            fontSize: 13,
            color: "var(--color-text-secondary)",
            cursor: "pointer",
            flexShrink: 0,
            marginTop: 2,
            boxShadow: "var(--shadow-card)",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#22c55e")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "var(--color-border-subtle)")
          }
        >
          ← Library
        </button>

        <LessonHeader
          title={title}
          module={category}
          current={currentIndex + 1}
          total={cards.length}
        />
      </div>

      {/* ── Progress bar ── */}
      <ProgressBar progress={progress} />

      {/* ── Card ── */}
      <CardShell
        card={card}
        direction={direction}
        dragX={dragX}
        isDragging={isDragging}
        isInflection={isInflection}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {card.type === "story" && <StoryCard card={card} />}

        {card.type === "inflection" && (
          <InflectionCard
            card={card}
            savedResponse={responses[card.inflectionKey]}
            onSubmit={handleInflectionSubmit}
          />
        )}

        {card.type === "reflection" && (
          <ReflectionCard
            responses={responses}
            reflections={reflections}
            inflectionContext={inflectionContext}
            isLoading={isLoading}
            hasError={hasError}
            onRetry={retry}
          />
        )}
      </CardShell>

      {/* ── Navigation ── */}
      <Navigation
        cards={cards}
        currentIndex={currentIndex}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrev={() => goTo("prev")}
        onNext={() => goTo("next")}
      />

      {/* ── Footer tagline ── */}
      <div
        style={{
          marginTop: 18,
          textAlign: "center",
          fontSize: 11,
          color: "var(--color-text-tertiary)",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.08em",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}
