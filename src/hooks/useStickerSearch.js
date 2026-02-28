import { useState, useEffect } from "react";

/** Klipy partner key — set VITE_KLIPY_APP_KEY in your .env file. */
const KLIPY_APP_KEY = import.meta.env.VITE_KLIPY_APP_KEY ?? "";

/** Stable customer ID — Klipy requires one per request. */
const CUSTOMER_ID = "mindful-app";

/** In-memory cache so the same query is never fetched twice. */
export const stickerCache = new Map();

/** Build the Klipy sticker search URL. */
function buildKlipyUrl(query) {
  return (
    `https://api.klipy.com/api/v1/${KLIPY_APP_KEY}/stickers/search` +
    `?q=${encodeURIComponent(query)}&customer_id=${CUSTOMER_ID}&per_page=1&content_filter=medium`
  );
}

/**
 * Extract the best sticker URL from a Klipy response.
 * Prefer sm.webp (small file, good quality), fall back to sm.gif, xs.gif.
 */
function extractStickerUrl(data) {
  const item = data?.data?.data?.[0];
  if (!item) return null;
  const file = item.file;
  return (
    file?.sm?.webp?.url ||
    file?.sm?.gif?.url  ||
    file?.xs?.webp?.url ||
    file?.xs?.gif?.url  ||
    null
  );
}

/**
 * Fire-and-forget prefetch for every card in a module.
 * Call once on mount so stickers are cached before the user swipes to them.
 */
export function preloadStickers(cards) {
  cards.forEach((card) => {
    if (card.stickerQuery && !stickerCache.has(card.stickerQuery)) {
      fetch(buildKlipyUrl(card.stickerQuery))
        .then((res) => res.json())
        .then((data) => {
          stickerCache.set(card.stickerQuery, extractStickerUrl(data));
        })
        .catch(() => {});
    }
  });
}

/**
 * Hook — fetches a single Klipy sticker for the given query.
 *
 * @param {string | null | undefined} query  Search terms, or falsy to skip.
 * @returns {{ stickerUrl: string | null, loading: boolean }}
 */
export function useStickerSearch(query) {
  const [stickerUrl, setStickerUrl] = useState(
    query ? stickerCache.get(query) ?? null : null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    if (stickerCache.has(query)) {
      setStickerUrl(stickerCache.get(query));
      return;
    }

    setLoading(true);
    fetch(buildKlipyUrl(query))
      .then((res) => res.json())
      .then((data) => {
        const url = extractStickerUrl(data);
        stickerCache.set(query, url);
        setStickerUrl(url);
      })
      .catch(() => setStickerUrl(null))
      .finally(() => setLoading(false));
  }, [query]);

  return { stickerUrl, loading };
}
